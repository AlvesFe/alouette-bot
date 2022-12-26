import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import { CustomInteraction } from '../types/discord'
import { getVoiceConnection } from '@discordjs/voice'
import embedFactory from '../factory/embeds'
import ServerService from '../services/server.service'


export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Deixa o canal de voz'),
  async execute(
    interaction: CustomInteraction,
    user: GuildMember,
    server: ServerService
  ) {
    const voiceChannel = user.voice.channel
    const connection = getVoiceConnection(interaction.guild.id)

    if (!voiceChannel) {
      return await interaction.reply({
        content: 'Você precisa estar em um canal de voz para executar este comando!',
        ephemeral: true
      })
    }

    if (voiceChannel?.id !== connection?.joinConfig.channelId) {
      return await interaction.reply({
        content: 'Você precisa estar no mesmo canal de voz do bot para executar este comando!',
        ephemeral: true
      })
    }
    const leaveEmbed = embedFactory({
      title: 'Desconectado',
      botAvatar: server.getServerInfo(interaction.guildId)?.bot.avatarURL(),
      botName: server.getServerInfo(interaction.guildId)?.bot.username,
      description: 'Saindo do canal de voz',
      color: process.env.BOT_COLOR as ColorResolvable,
      footer: {
        text: user.displayName,
        iconUrl: user.avatarURL()
      }
    })

    connection?.destroy()
    server.clearQueue(interaction.guildId)
    return await interaction.reply({ embeds: [leaveEmbed] })
  }
}