import { getVoiceConnection } from '@discordjs/voice'
import { VoiceBasedChannel, VoiceState } from 'discord.js'
import ServerService from '../services/server.service'
import { CustomClient } from '../types/discord'

export default {
  name: 'voiceStateUpdate',
  once: false,
  async execute(oldState: VoiceState, newState: VoiceState, _server: ServerService, client: CustomClient) {
    const channelId = newState.channelId || oldState.channelId
    if (!channelId) return
    const channel = await client.channels.fetch(channelId) as VoiceBasedChannel
    const membersInVoiceChannel = channel.members.size
    const isBotInVoiceChannel = channel.members.has(client.user.id)
    if (membersInVoiceChannel === 1 && isBotInVoiceChannel) {
      setTimeout(() => {
        const connection = getVoiceConnection(newState.guild.id)
        connection?.destroy()
      }, 5000)
    }
  }
}