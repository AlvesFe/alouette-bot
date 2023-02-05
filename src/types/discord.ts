import { ChatInputCommandInteraction, Client, Collection, GuildMember, SlashCommandBuilder } from 'discord.js'
import ServerService from '../services/server.service'

interface DefaultEvent {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any) => void
  once?: boolean
}
export interface Event {
  default: DefaultEvent
}

export interface CustomClient extends Client<true> {
  commands?: Collection<string, unknown>
}

export interface DefaultCommand {
  data: SlashCommandBuilder
  execute: (
    interaction: CustomInteraction,
    user?: GuildMember,
    serversInfo?: ServerService
  ) => void
}

export interface Command {
  default: DefaultCommand
}

export interface CustomInteraction extends ChatInputCommandInteraction<'cached'> {
  client: CustomClient
}