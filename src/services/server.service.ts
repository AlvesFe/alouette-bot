import { User } from 'discord.js'
import { Music, ServerInfo, ServerInfoItem } from '../types/server'

class ServerService {
  private server: ServerInfo = {}

  addServer(serverId: string, bot: User): void {
    this.server[serverId] = {
      serverId,
      queue: [],
      bot
    }
  }

  getServerInfo(serverId: string): ServerInfoItem | null {
    try {
      return this.server[serverId]
    } catch {
      return null
    }
  }

  addSong(serverId: string, song: Music): void {
    this.server[serverId].queue.push(song)
  }

  getQueue(serverId: string): Music[] {
    return this.server[serverId].queue
  }

  advanceSong(serverId: string): void {
    this.server[serverId].queue.shift()
  }

  clearQueue(serverId: string): void {
    this.server[serverId].queue = []
  }

  shuffleQueue(serverId: string): void {
    const queue = this.server[serverId].queue
    const firstMusic = queue.length > 0 ? queue.shift() : null
    const newQueue = queue.sort(() => Math.random() - 0.5)
    if (firstMusic) newQueue.unshift(firstMusic)
    this.server[serverId].queue = newQueue
  }
}

export default ServerService
