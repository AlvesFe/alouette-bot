import { GuildMember, User } from 'discord.js'

import { VideoItem } from './search'

export type ServerInfo = Map<string, ServerInfoItem>

export interface Music {
  videoInfo: VideoItem
  user: GuildMember
}

export interface ServerInfoItem {
  serverId: string
  queue: Music[]
  bot: User
}