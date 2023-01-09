import 'dotenv/config'
import discordService from './services/discord.service'

const start = async (): Promise<void> => {
  await discordService.registerCommands()
  await discordService.login()
}

start().catch(console.error)
