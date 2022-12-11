import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import embedFactory from '../factory/embeds'
import ServerService from '../services/server.service'
import { CustomInteraction } from '../types/discord'
import { EmbedField } from '../types/embed'

export default {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lista as músicas da fila'),
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

    const queue = serversInfo.getQueue(interaction.guild.id)
    const queueFields: EmbedField[] = []
    const loopLength = queue.length > 25 ? 25 : queue.length
    for (let i = 0; i < loopLength; i++) {
      queueFields.push({
        name: `#${i + 1} - ${queue[i].videoInfo.title}`,
        value: `**Autor:** ${queue[i].videoInfo.author.name}`
      })
    }

    const queueEmbed = embedFactory({
      title: 'Fila de músicas',
      botAvatar: serversInfo.getServerInfo(interaction.guild.id).bot.avatarURL(),
      botName: serversInfo.getServerInfo(interaction.guild.id).bot.username,
      fields: queueFields,
      color: process.env.BOT_COLOR as ColorResolvable,
      footer: {
        text: user.user.username
      }
    })

    return await interaction.reply({
      embeds: [queueEmbed]
    })
  }
}