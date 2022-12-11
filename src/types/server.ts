import { GuildMember, User } from 'discord.js'
import yts = require('yt-search')

export type ServerInfo = Record<string, ServerInfoItem>

export interface Music {
  videoInfo: yts.VideoMetadataResult | yts.PlaylistItem
  user: GuildMember
}

export interface ServerInfoItem {
  serverId: string
  queue: Music[]
  bot: User
}