import { ColorResolvable } from 'discord.js'

export interface EmbedBody {
  title: string
  color: ColorResolvable
  botName: string
  botAvatar: string
  description?: string
  thumbnail?: string
  fields?: EmbedField[]
  footer?: EmbedFooter
}

export interface EmbedField {
  name: string
  value: string
}

export interface EmbedFooter {
  text: string
  iconUrl?: string
}