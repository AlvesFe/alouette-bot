import { GuildMember, SlashCommandBuilder } from 'discord.js'
import { CustomInteraction } from '../types/discord'
import { getVoiceConnection, VoiceConnectionReadyState } from '@discordjs/voice'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pula a música atual'),
  async execute(
    interaction: CustomInteraction,
    user: GuildMember
  ) {
    const voiceChannel = user.voice.channel
    const connection = getVoiceConnection(interaction.guild.id)
    if (voiceChannel?.id !== connection?.joinConfig.channelId) {
      return interaction.reply({
        content: 'Você precisa estar no mesmo canal de voz do bot para executar este comando!',
        ephemeral: true
      })
    }
    (connection?.state as VoiceConnectionReadyState)?.subscription?.player.stop()
    return interaction.reply({ content: 'Pulando a música atual' })
  }
}