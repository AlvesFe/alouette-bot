import { CustomInteraction, DefaultCommand as Command } from '../types/discord'

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: CustomInteraction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
    if (!interaction.isChatInputCommand()) return
    const command: Command = interaction.client.commands.get(interaction.commandName)
    if (!command) return
    try {
      const botInfo = await interaction.client.users.fetch(process.env.CLIENT_ID)
      const user = await interaction.member.fetch()
      command.execute(interaction, botInfo, user)
    } catch (error) {
      return await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}