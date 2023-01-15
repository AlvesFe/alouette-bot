import errorMetric from '../factory/errorMessage'
import { SearchEngine, SearchResults, SearchType, VideoItem } from '../types/search'
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
          return await this.searchSpotify(url)
        case SearchEngine.YTB:
        default:
          return await this.searchYtb(query, url)
      }
    } catch (error) {
      errorMetric({
        message: 'Error searching music',
        error,
        data: {
          query
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
      const playlist = await ytbService.getPlaylist(playlistId)
      const videos = playlist.map(video => ({
        id: video.id,
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url || video.thumbnails[0].url,
        origin: SearchEngine.YTB,
        author: video.author.name
      }))

      return {
        playlist: videos,
        type: SearchType.Playlist
      }
    }
    const video = await ytbService.getVideo(videoId || query)
    return {
      video: {
        id: video.id,
        title: video.title,
        url: video.url,
        thumbnail: video.bestThumbnail.url || video.thumbnails[0].url,
        origin: SearchEngine.YTB,
        author: video?.author?.name,
        description: video.description || ''
      },
      type: SearchType.Video
    }
  }

  async searchSpotify(url: URL | null): Promise<SearchResults> {
    const type = url ? url.pathname.split('/')[1] : 'track'
    const id = url ? url.pathname.split('/')[2] : null

    if (id && type === 'playlist') {
      const playlist = await spotifyService.getPlaylistInfo(id)
      const musics = playlist.map(item => item.track && ({
        id: item.track.id,
        title: item.track.name,
        url: item.track.external_urls.spotify,
        thumbnail: item.track.album.images[0].url,
        origin: SearchEngine.SPOTIFY,
        author: item.track.artists[0].name
      })).filter(Boolean) as VideoItem[]

      return {
        playlist: musics,
        type: SearchType.Playlist
      }
    }

    if (id && type === 'album') {
      const album = await spotifyService.getAlbumInfo(id)
      const musics = album.map(item => ({
        id: item.id,
        title: item.name,
        url: item.external_urls.spotify,
        origin: SearchEngine.SPOTIFY,
        author: item.artists[0].name
      }))

      return {
        playlist: musics,
        type: SearchType.Playlist
      }
    }

    if (id && type === 'episode') {
      const episode = await spotifyService.getEpisodeInfo(id)
      return {
        video: {
          id: episode.id,
          title: episode.name,
          url: episode.external_urls.spotify,
          origin: SearchEngine.SPOTIFY,
          author: episode.show.name
        },
        type: SearchType.Video
      }
    }

    if (id && type === 'artist') {
      const artist = await spotifyService.getArtistTracks(id)
      const musics = artist.map(item => ({
        id: item.id,
        title: item.name,
        url: item.external_urls.spotify,
        thumbnail: item.album.images[0].url,
        origin: SearchEngine.SPOTIFY,
        author: item.artists[0].name
      })) as VideoItem[]

      return {
        playlist: musics,
        type: SearchType.Playlist
      }
    }

    const trackId = url?.pathname.split('/')[2]
    if (!trackId) throw new Error('Invalid track id')

    const track = await spotifyService.getTrackInfo(trackId)

    return {
      video: {
        id: track.id,
        title: track.name,
        url: track.external_urls.spotify,
        thumbnail: track.album.images[0].url,
        origin: SearchEngine.SPOTIFY,
        author: track.artists[0].name
      },
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
