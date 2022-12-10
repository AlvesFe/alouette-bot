import { CustomInteraction, DefaultCommand as Command } from '../types/discord'

export default {
  name: 'interactionCreate',
  once: false,
  execute(interaction: CustomInteraction) {
    console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
    if (!interaction.isChatInputCommand()) return
    const command: Command = interaction.client.commands.get(interaction.commandName)
    if (!command) return
    try {
      command.execute(interaction)
    } catch (error) {
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      })
    }
  }
}