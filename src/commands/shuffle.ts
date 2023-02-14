import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import embedFactory from '../factory/embeds'
import ServerService from '../services/server.service'
import { CustomInteraction } from '../types/discord'

export default {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Embaralha a fila de músicas'),
  async execute(interaction: CustomInteraction, user: GuildMember, serversInfo: ServerService) {
    const serverInfo = serversInfo.getServerInfo(interaction.guild.id)
    if (!serverInfo?.queue || serverInfo.queue.length === 0) {
      return interaction.reply({
        content: 'Não foi possível encontrar a fila de músicas!',
        ephemeral: true
      })
    }
    serversInfo.shuffleQueue(interaction.guild.id)
    const shuffledQueueEmbed = embedFactory({
      title: 'Fila de músicas embaralhada',
      description: 'A fila de músicas foi embaralhada com sucesso!',
      color: process.env.BOT_COLOR as ColorResolvable,
      footer: {
        text: `Comando executado por ${user.user.tag}`,
        iconUrl: user.user.displayAvatarURL()
      },
      botAvatar: serverInfo?.bot.avatarURL(),
      botName: serverInfo?.bot.username
    })

    return interaction.reply({
      embeds: [shuffledQueueEmbed]
    })
  }
}
