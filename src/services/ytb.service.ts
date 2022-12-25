import internal = require('stream')
import ytdl = require('ytdl-core')
import ytpl = require('ytpl')
import ytsr = require('ytsr')
import { SearchResults, SearchType } from '../types/ytb'
import parseUrl from '../util/parseUrl'

class YtbService {
  async search(query: string): Promise<SearchResults> {
    const url = parseUrl(query)
    const playlistId = url?.searchParams.get('list')
    if (playlistId) {
      return {
        playlist: await this.getPlaylist(playlistId),
        type: SearchType.Playlist
      }
    }
    const videoId = url?.searchParams.get('v')
    return {
      video: await this.getVideo(videoId || query),
      type: SearchType.Video
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