import { ChatInputCommandInteraction, Client, Collection, GuildMember, SlashCommandBuilder, User } from 'discord.js'

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
  execute: (
    interaction: CustomInteraction,
    botInfo?: User,
    user?: GuildMember
  ) => void
}

export interface Command {
  default: DefaultCommand
}

export interface CustomInteraction extends ChatInputCommandInteraction<'cached'> {
  client: CustomClient
}