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
  createAudioResource,
  VoiceConnectionStatus
} from '@discordjs/voice'
import { SearchEngine } from '../types/search'
import errorMetric from '../factory/errorMessage'

const DEFAULT_IDLE_TIME_SECONDS = 10
const { BOT_COLOR, IDLE_TIME_SECONDS } = process.env

class AudioService {
  private connection: VoiceConnection | undefined
  private readonly player: AudioPlayer = createAudioPlayer()
  private readonly channel: GuildTextBasedChannel
  private readonly idleTime: number =
    IDLE_TIME_SECONDS
      ? parseInt(IDLE_TIME_SECONDS)
      : DEFAULT_IDLE_TIME_SECONDS

  constructor(channel: GuildTextBasedChannel, server: ServerService) {
    this.channel = channel
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.player.on(AudioPlayerStatus.Idle, async () => this.handleIdle(server, channel))
    this.player.on(AudioPlayerStatus.AutoPaused, () => this.handleDisconnect(server, channel))
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

  handleDisconnect(server: ServerService, channel: GuildTextBasedChannel): void {
    if (this.connection?.state.status !== VoiceConnectionStatus.Disconnected) return
    this.leaveChannel()
    server.clearQueue(channel.guildId)
  }

  async play({ videoInfo }: Music): Promise<void> {
    try {
      if (videoInfo.origin === SearchEngine.SPOTIFY) {
        const video = await ytbService.getVideo(`${videoInfo.author} ${videoInfo.title}`).catch(() => {
          console.error(`Audioservice failed to play ${videoInfo.title}, skipping...`)
          this.player.stop()
        })
        if (!video) return
        if (!videoInfo.thumbnail) videoInfo.thumbnail = video.bestThumbnail.url
        videoInfo.url = video.url
      }
      const url = videoInfo.url
      const video = await ytbService.getAudioStream(url)
      const audioStream = createAudioResource(video)
      this.player.play(audioStream)
    } catch (error) {
      this.player.stop()
      await this.channel.send({
        content: `Não foi possível tocar a música **${videoInfo.title}** pulando...`
      })
      errorMetric({
        message: 'Could not play audio',
        error,
        data: {
          videoInfo
        }
      })
    }
  }

  async handleIdle(server: ServerService, channel: GuildTextBasedChannel): Promise<void> {
    const queue = (): Music[] => server.getQueue(channel.guildId)
    server.advanceSong(channel.guildId)
    if (queue().length > 0) {
      await this.play(queue()[0])
      const playingEmbed = this.createPlayingEmbed(server, channel, queue()[0])
      await channel.send({ embeds: [playingEmbed] })
      return
    }
    this.player.stop()
    setTimeout(() => {
      if (queue().length === 0) {
        this.leaveChannel()
        const inactiveEmbed = this.createInactiveEmbed(server, channel)
        void channel.send({ embeds: [inactiveEmbed] })
      }
    }, this.idleTime * 1000)
  }

  private createInactiveEmbed(server: ServerService, channel: GuildTextBasedChannel): EmbedBuilder {
    const botAvatar = server?.getServerInfo(channel.guildId)?.bot.avatarURL()
    const botName = server?.getServerInfo(channel.guildId)?.bot.username
    return embedFactory({
      title: 'Desconectado',
      botAvatar,
      botName,
      description: 'Saindo do canal de voz por inatividade',
      color: BOT_COLOR as ColorResolvable,
      footer: {
        text: 'Desconectado'
      }
    })
  }

  private createPlayingEmbed(server: ServerService, channel: GuildTextBasedChannel, music: Music): EmbedBuilder {
    const botAvatar = server?.getServerInfo(channel.guildId)?.bot.avatarURL()
    const botName = server?.getServerInfo(channel.guildId)?.bot.username
    return embedFactory({
      title: 'Tocando música',
      botAvatar,
      botName,
      description: `**[${music.videoInfo.title}](${music.videoInfo.url}})**`,
      color: BOT_COLOR as ColorResolvable,
      footer: {
        text: 'Tocando'
      },
      thumbnail: music.videoInfo.thumbnail,
      fields: [
        {
          name: 'Autor',
          value: music.videoInfo.author || 'Desconhecido'
        }
      ]
    })
  }
}

export default AudioService