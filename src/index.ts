import 'dotenv/config'
import discordService from './services/discord.service'

const start = async (): Promise<void> => {
  await discordService.registerCommands()
  await discordService.login(process.env.TOKEN)
}

start().catch(console.error)