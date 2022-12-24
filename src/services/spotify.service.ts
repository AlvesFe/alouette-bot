import Spotify from 'spotify-web-api-node'
import { SearchResults } from '../types/ytb'
import ytbService from './ytb.service'
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env

class SpotifyService {
  client: Spotify
  constructor() {
    this.client = new Spotify({
      clientId: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_SECRET
    })
  }

  async search(query: string): Promise<SearchResults> {
    const url = new URL(query)
    const trackId = url.pathname.split('/').pop()
    const trackInfo = await this.getTrackInfo(trackId as string)
    return await ytbService.search(`${trackInfo.artists[0].name} ${trackInfo.name}`)
  }

  async getTrackInfo(trackId: string): Promise<SpotifyApi.TrackObjectFull> {
    const track = await this.client.getTrack(trackId)
    return track.body
  }
}

export default new SpotifyService()
