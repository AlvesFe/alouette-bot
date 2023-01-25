import 'dotenv/config'
import errorMetric from './factory/errorMessage'
import discordService from './services/discord.service'

const start = async (): Promise<void> => {
  await discordService.registerCommands()
  await discordService.login()
}

start().catch((error) => {
  errorMetric({
    message: error.message,
    error
  })
})
