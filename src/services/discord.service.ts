import {
  REST,
  Routes,
  Client,
  Collection,
  GatewayIntentBits,
  RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js'
import * as fs from 'fs'
import { Command, CustomClient, Event } from '../types/discord'

class DiscordService {
  private readonly client: CustomClient

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
      ]
    })
    this.getCommands()
    this.getEvents()
  }

  getCommands(): void {
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    this.client.commands = new Collection()

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: Command = require(`../commands/${file}`)
      this.client.commands.set(command.default.data.name, command.default)
    }
  }

  getEvents(): void {
    const eventFiles = fs
      .readdirSync('./src/events')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    for (const file of eventFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const event: Event = require(`../events/${file}`)
      if (event.default.once) {
        this.client.once(event.default.name, (...args) => event.default.execute(...args))
      } else {
        this.client.on(event.default.name, (...args) => event.default.execute(...args))
      }
    }
  }

  async login(token: string): Promise<string> {
    return await this.client.login(token)
  }

  async registerCommands(): Promise<void> {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

    for (const file of commandFiles) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const command: Command = require(`../commands/${file}`)
      commands.push(command.default.data.toJSON())
    }

    if (process.env.NODE_ENV !== 'production') {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      )
      return console.log('Successfully registered local application commands.')
    }

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    )
    console.log('Successfully registered global application commands.')
  }
}

export default new DiscordService()