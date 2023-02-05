import { ColorResolvable, GuildMember, GuildTextBasedChannel, SlashCommandBuilder } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'
import embedFactory from '../factory/embeds'
import AudioService from '../services/audio.service'
import ServerService from '../services/server.service'
import { CustomInteraction } from '../types/discord'
import { EmbedField } from '../types/embed'
import searchService from '../services/search.service'
import { SearchType } from '../types/search'

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
    const serverInfo = serversInfo.getServerInfo(interaction.guild.id)
    if (!voiceChannel) {
      return interaction.reply({
        content: 'Você precisa estar em um canal de voz para executar este comando!',
        ephemeral: true
      })
    }

    const music = interaction.options.getString('música')
    if (!music) {
      return interaction.reply({
        content: 'Você precisa informar o nome da música a ser tocada!',
        ephemeral: true
      })
    }

    const searchResult = await searchService.search(music)
    if (!searchResult) {
      return interaction.reply({
        content: 'Não foi possível encontrar a música informada!',
        ephemeral: true
      })
    }

    let audioPlayer: AudioService

    if (searchResult.type === SearchType.Playlist && searchResult.playlist) {
      const playlist = searchResult.playlist
      playlist.forEach(video => {
        serversInfo.addSong(interaction.guild.id, {
          user,
          videoInfo: video
        })
      })
      const playlistFields: EmbedField[] = []
      const loopLength = (playlist.length > 5 ? 5 : playlist.length) || 0
      for (let i = 0; i < loopLength; i++) {
        playlistFields.push({
          name: playlist[i]?.title,
          value: `\` ${i + 1} \` - ${playlist[i].author}`
        })
      }

      playlist.length > 5 && playlistFields.push({
        name: `...e mais ${playlist.length - loopLength} músicas!`,
        value: '\u200b'
      })

      const playlistEmbed = embedFactory({
        title: 'Playlist adicionada à fila',
        description: `**${playlist.length}** músicas adicionadas à fila`,
        botAvatar: serverInfo?.bot.avatarURL(),
        botName: serverInfo?.bot.username,
        color: process.env.BOT_COLOR as ColorResolvable,
        fields: playlistFields,
        footer: {
          text: user.displayName,
          iconUrl: user.user.avatarURL()
        }
      })

      if (!getVoiceConnection(interaction.guild.id)) {
        audioPlayer = new AudioService(textChannel as GuildTextBasedChannel, serversInfo)
        audioPlayer.joinChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator
        })
        await audioPlayer.play(serversInfo.getQueue(interaction.guild.id)[0])
      }

      return interaction.reply({
        embeds: [playlistEmbed]
      })
    }

    if (!searchResult.video) {
      return interaction.reply({
        content: 'Não foi possível encontrar a música informada!',
        ephemeral: true
      })
    }

    serversInfo.addSong(interaction.guild.id, {
      user,
      videoInfo: searchResult.video
    })

    const songEmbed = embedFactory({
      title: searchResult.video.title,
      description: 'Musica adicionada à fila!',
      botAvatar: serverInfo?.bot.avatarURL(),
      botName: serverInfo?.bot.username,
      color: process.env.BOT_COLOR as ColorResolvable,
      thumbnail: searchResult.video.thumbnail || null,
      url: searchResult.video.url,
      footer: {
        text: `${user.displayName}`,
        iconUrl: user.user.avatarURL()
      }
    })

    if (!getVoiceConnection(interaction.guild.id)) {
      audioPlayer = new AudioService(textChannel as GuildTextBasedChannel, serversInfo)
      audioPlayer.joinChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
      })
      await audioPlayer.play(serversInfo.getQueue(interaction.guild.id)[0])
    }

    return interaction.reply({
      embeds: [songEmbed]
    })
  }
}
