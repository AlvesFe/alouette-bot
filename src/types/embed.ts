import { ColorResolvable } from 'discord.js'

export interface EmbedBody {
  title: string
  color: ColorResolvable
  botName?: string | null
  botAvatar?: string | null
  description?: string
  thumbnail?: string
  fields?: EmbedField[]
  footer?: EmbedFooter
  url?: string
}

export interface EmbedField {
  name: string
  value: string
}

export interface EmbedFooter {
  text: string
  iconUrl?: string | null
}