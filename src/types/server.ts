import { GuildMember, User } from 'discord.js'
import { Video } from 'ytsr'
import { PlaylistItem } from './ytb'

export type ServerInfo = Record<string, ServerInfoItem>

export interface Music {
  videoInfo: Video | PlaylistItem
  user: GuildMember
}

export interface ServerInfoItem {
  serverId: string
  queue: Music[]
  bot: User
}