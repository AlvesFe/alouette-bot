import ServerService from '../services/server.service'
import { CustomInteraction, DefaultCommand as Command } from '../types/discord'

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: CustomInteraction, serversInfo: ServerService) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
    if (!interaction.isChatInputCommand()) return
    const command: Command = interaction.client.commands.get(interaction.commandName)
    if (!command) return
    const server = serversInfo.getServerInfo(interaction.guild.id)
    try {
      const botInfo = await interaction.client.users.fetch(process.env.CLIENT_ID)
      if (!server) serversInfo.addServer(interaction.guild.id, botInfo)
      const user = await interaction.member.fetch()
      command.execute(interaction, user, serversInfo)
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}