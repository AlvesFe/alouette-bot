import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import embedFactory from '../factory/embeds'
import ServerService from '../services/server.service'
import { CustomInteraction } from '../types/discord'
import { EmbedField } from '../types/embed'

export default {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lista as músicas da fila')
    .addNumberOption(option =>
      option
        .setName('página')
        .setDescription('Página da fila a ser exibida')
        .setRequired(false)
    ),
  async execute(
    interaction: CustomInteraction,
    user: GuildMember,
    serversInfo: ServerService
  ) {
    if (serversInfo.getQueue(interaction.guild.id).length === 0) {
      return await interaction.reply({
        content: 'Não há músicas na fila!',
        ephemeral: true
      })
    }
    let page = interaction.options.getNumber('página') || 1
    const serverInfo = serversInfo.getServerInfo(interaction.guild.id)
    const queue = serversInfo.getQueue(interaction.guild.id)

    const queueFieldsPaged = queue.reduce<EmbedField[][]>((acc, field, index) => {
      const page = Math.floor(index / 10)
      if (!acc[page]) acc[page] = []
      acc[page].push({
        name: `#${index + 1} - ${field.videoInfo.title}`,
        value: `**Autor:** ${field.videoInfo.author}`,
        thumbnail: field.videoInfo.thumbnail
      })
      return acc
    }, [])

    const maxPage = queueFieldsPaged.length
    if (page > maxPage) page = maxPage
    if (page < 1) page = 1
    const queriedPage = queueFieldsPaged[page - 1]
    const queueEmbed = embedFactory({
      title: 'Fila de músicas',
      description: `Página \`${page}\` de \`${queueFieldsPaged.length}\``,
      botAvatar: serverInfo?.bot.avatarURL(),
      botName: serverInfo?.bot.username,
      fields: queriedPage,
      color: process.env.BOT_COLOR as ColorResolvable,
      thumbnail: queriedPage[0]?.thumbnail,
      footer: {
        text: user.displayName,
        iconUrl: user.user.avatarURL()
      }
    })

    return await interaction.reply({
      embeds: [queueEmbed]
    })
  }
}