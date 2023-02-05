import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import embedFactory from '../factory/embeds'
import ServerService from '../services/server.service'
import { CustomInteraction } from '../types/discord'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),
  async execute(
    interaction: CustomInteraction,
    user: GuildMember,
    serverInfo: ServerService
  ) {
    try {
      const botInfo = serverInfo?.getServerInfo(interaction.guild.id)?.bot
      if (!botInfo) {
        throw new Error('Bot info not found.')
      }
      const embed = embedFactory({
        title: 'Pong!',
        botName: botInfo.username,
        botAvatar: botInfo.avatarURL(),
        color: process.env.BOT_COLOR as ColorResolvable,
        description: `Latência da API: ${interaction.client.ws.ping}ms`,
        footer: {
          text: `Comando executado por ${user.displayName}`,
          iconUrl: user.user.avatarURL()
        }
      })
      return await interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.error(err)
      return await interaction.reply({
        ephemeral: true,
        embeds: [
          embedFactory({
            title: 'Erro ao executar o comando',
            description: 'Tente novamente mais tarde.',
            color: 'Red'
          })
        ]
      })
    }
  }
}
