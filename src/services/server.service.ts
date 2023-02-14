import { User } from 'discord.js'
import { Music, ServerInfo, ServerInfoItem } from '../types/server'

class ServerService {
  private readonly server: ServerInfo = new Map()

  addServer(serverId: string, bot: User): void {
    this.server.set(serverId, {
      serverId,
      queue: [],
      bot
    })
  }

  getServerInfo(serverId: string): ServerInfoItem | null {
    return this.server.get(serverId) || null
  }

  addSong(serverId: string, song: Music): void {
    this.server.get(serverId)?.queue.push(song)
  }

  getQueue(serverId: string): Music[] {
    return this.server.get(serverId)?.queue || []
  }

  advanceSong(serverId: string): void {
    this.server.get(serverId)?.queue.shift()
  }

  clearQueue(serverId: string): void {
    const server = this.server.get(serverId)
    if (server) server.queue = []
  }

  shuffleQueue(serverId: string): void {
    const queue = this.server.get(serverId)?.queue || []
    if (queue.length <= 1) return
    const firstMusic = queue.length > 0 ? queue.shift() : null
    const newQueue = queue.sort(() => Math.random() - 0.5)
    if (firstMusic) {
      newQueue.unshift(firstMusic)
    }
    (this.server.get(serverId) as ServerInfoItem).queue = newQueue
  }
}

export default ServerService
