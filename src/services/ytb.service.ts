import internal = require('stream')
import ytdl = require('ytdl-core')
import ytpl = require('ytpl')
import ytsr = require('ytsr')
import { SearchResults } from '../types/ytb'

class YtbService {
  async search(query: string): Promise<SearchResults> {
    try {
      const url = new URL(query)
      const playlistId = url.searchParams.get('list')
      if (playlistId) {
        return {
          playlist: await this.getPlaylist(playlistId),
          type: 'playlist'
        }
      }
      const videoId = url.searchParams.get('v')
      if (!videoId) throw new Error('Invalid URL')
      return {
        video: await this.getVideo(videoId),
        type: 'video'
      }
    } catch {
      console.error('Failed to parse URL, searching for video...')
      return {
        video: await this.getVideo(query),
        type: 'video'
      }
    }
  }

  async getVideo(query: string): Promise<ytsr.Video> {
    const filters = (await ytsr.getFilters(query))
      .get('Type')?.get('Video')?.url
    if (!filters) throw new Error('No video found')
    const search = await ytsr(filters, { limit: 1 })
    return search.items[0] as ytsr.Video
  }

  async getPlaylist(playlistId: string): Promise<ytpl.Item[]> {
    const playlist = await ytpl(playlistId)
    return playlist.items
  }

  async getAudioStream(url: string): Promise<internal.Readable> {
    return ytdl(url, {
      filter: 'audioonly',
      highWaterMark: 1048576 * 32
    }).on('error', console.error)
  }
}

export default new YtbService()