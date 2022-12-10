import { ColorResolvable, GuildMember, SlashCommandBuilder, User } from 'discord.js'
import embedFactory from '../factory/embeds'
import { CustomInteraction } from '../types/discord'

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),
  async execute(
    interaction: CustomInteraction,
    botInfo: User,
    user: GuildMember
  ) {
    const embed = await embedFactory({
      title: 'Pong!',
      botName: botInfo.username,
      botAvatar: botInfo.avatarURL(),
      color: process.env.BOT_COLOR as ColorResolvable,
      description: `Latência da API: ${interaction.client.ws.ping}ms`,
      footer: {
        text: `Comando executado por ${user.user.username}`,
        iconUrl: user.user.avatarURL()
      }
    })
    return await interaction.reply({ embeds: [embed] })
  }
}
