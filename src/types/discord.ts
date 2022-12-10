import { ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder } from 'discord.js'

interface DefaultEvent {
  name: string
  execute: (...args: any) => void
  once?: boolean
}
export interface Event {
  default: DefaultEvent
}

export interface CustomClient extends Client {
  commands?: Collection<string, any>
}

export interface DefaultCommand {
  data: SlashCommandBuilder
  execute: (interaction: CustomInteraction) => void
}

export interface Command {
  default: DefaultCommand
}

export interface CustomInteraction extends ChatInputCommandInteraction<'raw'> {
  client: CustomClient
}