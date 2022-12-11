import { ColorResolvable, EmbedBuilder, GuildTextBasedChannel } from 'discord.js'
import embedFactory from '../factory/embeds'
import { ConnectionParams } from '../types/audio'
import { Music } from '../types/server'
import ServerService from './server.service'
import ytbService from './ytb.service'
import {
  joinVoiceChannel,
  createAudioPlayer,
  AudioPlayer,
  VoiceConnection,
  AudioPlayerStatus,
  createAudioResource
} from '@discordjs/voice'

class AudioService {
  player: AudioPlayer = createAudioPlayer()
  connection: VoiceConnection | undefined

  constructor(channel: GuildTextBasedChannel, server: ServerService) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.player.on(AudioPlayerStatus.Idle, async () => await this.handleIdle(server, channel))
  }

  joinChannel({
    channelId,
    guildId,
    adapterCreator
  }: ConnectionParams): void {
    this.connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator
    })
    this.connection.subscribe(this.player)
  }

  leaveChannel(): void {
    this.player?.stop()
    this.connection?.destroy()
  }

  async play(music: Music): Promise<void> {
    const video = await ytbService.getAudioStream(music.videoInfo.url)
    const audioStream = createAudioResource(video)
    this.player.play(audioStream)
  }

  async handleIdle(server: ServerService, channel: GuildTextBasedChannel): Promise<void> {
    const queue = (): Music[] => server.getQueue(channel.guildId)
    server.advanceSong(channel.guildId)
    if (queue().length === 0) {
      this.player.stop()
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(async () => {
        if (queue().length === 0) {
          this.leaveChannel()
          const inactiveEmbed = this.createInactiveEmbed(server, channel)
          await channel.send({ embeds: [inactiveEmbed] })
        }
      }, 10000)
    } else {
      await this.play(queue()[0])
      const playingEmbed = this.createPlayingEmbed(server, channel, queue()[0])
      await channel.send({ embeds: [playingEmbed] })
    }
  }

  private createInactiveEmbed(server: ServerService, channel: GuildTextBasedChannel): EmbedBuilder {
    return embedFactory({
      title: 'Desconectado',
      botAvatar: server.getServerInfo(channel.guildId).bot.avatarURL(),
      botName: server.getServerInfo(channel.guildId).bot.username,
      description: 'Saindo do canal de voz por inatividade',
      color: process.env.BOT_COLOR as ColorResolvable,
      footer: {
        text: 'Desconectado'
      }
    })
  }

  private createPlayingEmbed(server: ServerService, channel: GuildTextBasedChannel, music: Music): EmbedBuilder {
    return embedFactory({
      title: 'Tocando música',
      botAvatar: server.getServerInfo(channel.guildId).bot.avatarURL(),
      botName: server.getServerInfo(channel.guildId).bot.username,
      description: `**${music.videoInfo.title}**`,
      color: process.env.BOT_COLOR as ColorResolvable,
      footer: {
        text: 'Tocando'
      },
      thumbnail: music.videoInfo.thumbnail,
      fields: [
        {
          name: 'Autor',
          value: music.videoInfo.author.name
        }
      ]
    })
  }
}

export default AudioService