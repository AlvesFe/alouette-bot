import * as yts from 'yt-search'
import ytdl = require('ytdl-core')
import { SearchResults, PlaylistItem } from '../types/ytb'

class YtbService {
  async search(query: string): Promise<SearchResults> {
    try {
      const url = new URL(query)
      const videoId = url.searchParams.get('v')
      if (!videoId) throw new Error('Invalid URL')
      const playlistId = url.searchParams.get('list')
      if (playlistId) {
        return {
          playlist: await this.getPlaylist(playlistId),
          type: 'playlist'
        }
      }
      return {
        video: await this.getVideo({ videoId }),
        type: 'video'
      }
    } catch {
      console.error('Failed to parse URL, searching for video...')
      return {
        video: await this.getVideo({ query }),
        type: 'video'
      }
    }
  }

  async getVideo({ query, videoId }: { query?: string; videoId?: string }): Promise<yts.VideoMetadataResult> {
    if (videoId) {
      const video = await yts.search({ videoId })
      return video
    }
    if (!query) {
      throw new Error('No query or videoId provided.')
    }

    videoId = (await yts.search({ query })).videos[0].videoId
    return await this.getVideo({ videoId })
  }

  async getPlaylist(playlistId: string): Promise<PlaylistItem[]> {
    const playlist = await yts.search({ listId: playlistId })
    return playlist.videos.map((video, index) => ({
      ...video,
      url: `https://www.youtube.com/watch?v=${video.videoId}`,
      description: `Música ${index + 1} da playlist ${playlist.title}`
    }))
  }

  async getAudioStream(url: string): Promise<any> {
    return ytdl(url, {
      filter: 'audioonly',
      highWaterMark: 1048576 * 32
    }).on('error', (e) => {
      console.error(e)
    })
  }
}

export default new YtbService()