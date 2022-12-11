import { EmbedBuilder } from 'discord.js'
import { EmbedBody } from '../types/embed'

const embedFactory = (body: EmbedBody): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setTimestamp()
    .setTitle(body.title)
    .setColor(body.color || 'Random')
    .setAuthor({
      name: body.botName,
      iconURL: body.botAvatar
    })
  if (body.url) embed.setURL(body.url)
  if (body.description) embed.setDescription(body.description)
  if (body.thumbnail) embed.setThumbnail(body.thumbnail)
  if (body.fields) embed.addFields(body.fields)
  if (body.footer) {
    embed.setFooter({
      text: body.footer.text,
      iconURL: body.footer.iconUrl
    })
  }

  return embed
}

export default embedFactory