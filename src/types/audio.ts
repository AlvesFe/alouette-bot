import { DiscordGatewayAdapterCreator } from '@discordjs/voice'

export interface ConnectionParams {
  channelId: string
  guildId: string
  adapterCreator: DiscordGatewayAdapterCreator
}