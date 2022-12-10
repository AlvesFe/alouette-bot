import { GuildMember, SlashCommandBuilder, User } from 'discord.js'
import ytbService from '../services/ytb.service'
import { CustomInteraction } from '../types/discord'

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Toca uma música no canal de voz')
    .addStringOption(option =>
      option
        .setName('música')
        .setDescription('Nome da música a ser tocada')
        .setRequired(true)
    ),
  async execute(
    interaction: CustomInteraction,
    botInfo: User,
    user: GuildMember
  ) {
    const voiceChannel = user.voice.channel
    if (!voiceChannel) {
      return await interaction.reply({
        content: 'Você precisa estar em um canal de voz para executar este comando!',
        ephemeral: true
      })
    }

    const music = interaction.options.getString('música')
    if (!music) {
      return await interaction.reply({
        content: 'Você precisa informar o nome da música a ser tocada!',
        ephemeral: true
      })
    }

    const searchResult = await ytbService.search(music)
    if (!searchResult) {
      return await interaction.reply({
        content: 'Não foi possível encontrar a música informada!',
        ephemeral: true
      })
    }

    if (searchResult.type === 'playlist') {
      // tratamento de playlist
    }

    // tratamento de música
  }
}
