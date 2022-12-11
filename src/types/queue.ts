import { GuildMember } from 'discord.js'
import yts = require('yt-search')
import ServerService from '../services/server.service'

export interface QueueAddParams {
  video?: yts.VideoMetadataResult
  playlist?: yts.VideoMetadataResult[]
  user: GuildMember
  server: ServerService
  serverId: string
}