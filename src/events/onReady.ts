import { Client } from 'discord.js'

export default {
  name: 'ready',
  once: true,
  execute(client: Client) {
    if (!client.user) throw new Error('Client is not ready.')
    console.log(`Ready! Logged in as ${client.user.tag}`)
  }
}