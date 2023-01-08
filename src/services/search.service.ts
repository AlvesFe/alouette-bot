import errorMetric from '../factory/errorMessage'
import { SearchEngine } from '../types/search'
import { SearchResults, SearchType } from '../types/ytb'
import parseUrl from '../util/parseUrl'
import spotifyService from './spotify.service'
import ytbService from './ytb.service'

const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env

class SearchService {
  async search(query: string): Promise<SearchResults | null> {
    try {
      const url = parseUrl(query)
      const searchEngine = this.defineSearchEngine(url)
      switch (searchEngine) {
        case SearchEngine.SPOTIFY:
          return await this.searchSpotify(query, url)
        case SearchEngine.YTB:
        default:
          return await this.searchYtb(query, url)
      }
    } catch (error) {
      errorMetric({
        message: 'Error searching music',
        error,
        data: {
          query,
          timestamp: new Date().toISOString()
        }
      })
      return null
    }
  }

  async searchYtb(query: string, url: URL | null): Promise<SearchResults> {
    const videoId = url?.hostname === 'youtu.be'
      ? url.pathname.split('/')[1]
      : url?.searchParams.get('v')
    const playlistId = url?.searchParams.get('list')
    if (playlistId) {
      return {
        playlist: await ytbService.getPlaylist(playlistId),
        type: SearchType.Playlist
      }
    }
    return {
      video: await ytbService.getVideo(videoId || query),
      type: SearchType.Video
    }
  }

  async searchSpotify(query: string, url: URL | null): Promise<SearchResults> {
    const trackId = url?.pathname.split('/')[2]
    let track: SpotifyApi.TrackObjectFull | null
    if (trackId) {
      track = await spotifyService.getTrackInfo(trackId)
      return {
        video: await ytbService.getVideo(`${track.artists[0].name} ${track.name}`),
        type: SearchType.Video
      }
    }
    track = await spotifyService.searchTrack(query)
    if (!track) throw new Error('Música não encontrada')
    return {
      video: await ytbService.getVideo(`${track.artists[0].name} ${track.name}`),
      type: SearchType.Video
    }
  }

  defineSearchEngine(url: URL | null): SearchEngine {
    if (!SPOTIFY_SECRET && !SPOTIFY_CLIENT_ID) {
      return SearchEngine.YTB
    }
    switch (url?.hostname) {
      case 'open.spotify.com':
      case 'play.spotify.com':
      case 'spotify.com':
        return SearchEngine.SPOTIFY
      case 'music.youtube.com':
      case 'www.youtube.com':
      case 'youtube.com':
      case 'youtu.be':
      default:
        return SearchEngine.YTB
    }
  }
}

export default new SearchService()
