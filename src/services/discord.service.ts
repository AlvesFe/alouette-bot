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
import ServerService from './server.service'

const { TOKEN, CLIENT_ID, GUILD_ID, NODE_ENV } = process.env
class DiscordService {
  private readonly client: CustomClient

  constructor() {
    this.client = new Client<true>({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
      ]
    })
    void this.getCommands()
    void this.getEvents()
  }

  async getCommands(): Promise<void> {
    console.info('Loading commands...')
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    this.client.commands = new Collection()

    for (const file of commandFiles) {
      const command: Command = await import(`../commands/${file}`)
      this.client.commands.set(command.default.data.name, command.default)
    }
  }

  async getEvents(): Promise<void> {
    console.info('Loading events...')
    const serversInfo = new ServerService()
    const eventFiles = fs
      .readdirSync('./src/events')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    for (const file of eventFiles) {
      const event: Event = await import(`../events/${file}`)
      if (event.default.once) {
        this.client.once(event.default.name, (...args) => event.default.execute(...args))
      } else {
        this.client.on(event.default.name, (...args) => event.default.execute(...args, serversInfo, this.client))
      }
    }
  }

  async login(): Promise<string> {
    if (!TOKEN) {
      throw new Error('No token provided.')
    }
    return this.client.login(TOKEN)
  }

  async registerCommands(): Promise<void> {
    if (!TOKEN) throw new Error('No token provided.')
    if (!GUILD_ID) throw new Error('No guild id provided.')
    if (!CLIENT_ID) throw new Error('No client id provided.')
    console.log('Registering commands...')

    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter(
        file => file.endsWith('.js') || file.endsWith('.ts')
      )
      .map(file => file.split('.')[0])

    const rest = new REST({ version: '10' }).setToken(TOKEN)

    for (const file of commandFiles) {
      const command: Command = await import(`../commands/${file}`)
      commands.push(command.default.data.toJSON())
    }

    if (NODE_ENV !== 'production') {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      )
      return console.info('Successfully registered local application commands.')
    }

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    )
    console.info('Successfully registered global application commands.')
  }
}

export default new DiscordService()