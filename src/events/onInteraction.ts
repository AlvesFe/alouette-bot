import ServerService from '../services/server.service'
import { CustomInteraction, DefaultCommand as Command } from '../types/discord'

const { CLIENT_ID } = process.env

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: CustomInteraction, serversInfo: ServerService) {
    if (!interaction.isChatInputCommand()) return
    if (!CLIENT_ID) throw new Error('CLIENT_ID is not defined in .env file.')
    console.log(`${interaction.user.tag} in #${interaction?.channel?.name} triggered an interaction.`)
    const command: Command = interaction?.client?.commands?.get(interaction.commandName)
    if (!command) return
    const server = serversInfo.getServerInfo(interaction.guild.id)
    try {
      const botInfo = await interaction.client.users.fetch(CLIENT_ID)
      if (!server) serversInfo.addServer(interaction.guild.id, botInfo)
      const user = await interaction.member.fetch()
      command.execute(interaction, user, serversInfo)
    } catch (error) {
      console.error(error)
      return await interaction.reply({
        content: 'Houve um problema ao executar esse comando.',
        ephemeral: true
      })
    }
  }
}