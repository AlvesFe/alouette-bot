import { ColorResolvable, GuildMember, SlashCommandBuilder } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import embedFactory from '../factory/embeds'
import AudioService from '../services/audio.service'
import ServerService from '../services/server.service'
import ytbService from '../services/ytb.service'
import { CustomInteraction } from '../types/discord'
import { EmbedField } from '../types/embed'

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
    user: GuildMember,
    serversInfo: ServerService
  ) {
    const voiceChannel = user.voice.channel
    const textChannel = interaction.channel
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

    let audioPlayer: AudioService

    if (searchResult.type === 'playlist') {
      searchResult.playlist.forEach(video => {
        serversInfo.addSong(interaction.guild.id, {
          user,
          videoInfo: video
        })
      })
      const playlistFields: EmbedField[] = []
      const loopLength = searchResult.playlist.length > 5 ? 5 : searchResult.playlist.length
      for (let i = 0; i < loopLength; i++) {
        playlistFields.push({
          name: searchResult.playlist[i].title,
          value: `\` ${i + 1} \` - ${searchResult.playlist[i].author.name}`
        })
      }

      loopLength > 5 && playlistFields.push({
        name: `...e mais ${searchResult.playlist.length - loopLength} músicas!`,
        value: '\u200b'
      })

      const playlistEmbed = embedFactory({
        title: 'Playlist adicionada à fila',
        description: `**${searchResult.playlist.length}** músicas adicionadas à fila`,
        botAvatar: serversInfo.getServerInfo(interaction.guild.id).bot.avatarURL(),
        botName: serversInfo.getServerInfo(interaction.guild.id).bot.username,
        color: process.env.BOT_COLOR as ColorResolvable,
        fields: playlistFields
      })

      if (!getVoiceConnection(interaction.guild.id)) {
        audioPlayer = new AudioService(textChannel, serversInfo)
        audioPlayer.joinChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator
        })
        await audioPlayer.play(serversInfo.getQueue(interaction.guild.id)[0])
      }

      return await interaction.reply({
        embeds: [playlistEmbed]
      })
    }

    serversInfo.addSong(interaction.guild.id, {
      user,
      videoInfo: searchResult.video
    })

    const songEmbed = embedFactory({
      title: searchResult.video.title,
      description: 'Musica adicionada à fila!',
      botAvatar: serversInfo.getServerInfo(interaction.guild.id).bot.avatarURL(),
      botName: serversInfo.getServerInfo(interaction.guild.id).bot.username,
      color: process.env.BOT_COLOR as ColorResolvable,
      thumbnail: searchResult.video.thumbnail,
      url: searchResult.video.url,
      footer: {
        text: `${user.displayName}`,
        iconUrl: user.user.avatarURL()
      }
    })

    if (!getVoiceConnection(interaction.guild.id)) {
      audioPlayer = new AudioService(textChannel, serversInfo)
      audioPlayer.joinChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })
      await audioPlayer.play(serversInfo.getQueue(interaction.guild.id)[0])
    }

    return await interaction.reply({
      embeds: [songEmbed]
    })
  }
}
