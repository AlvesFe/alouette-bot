import Spotify from 'spotify-web-api-node'
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env

class SpotifyService {
  client = new Spotify({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_SECRET
  })

  constructor() {
    void this.auth()
  }

  async auth(): Promise<void> {
    const data = await this.client.clientCredentialsGrant()
    this.client.setAccessToken(data.body.access_token)
  }

  async searchTrack(query: string): Promise<SpotifyApi.TrackObjectFull | null> {
    const data = await this.client.searchTracks(query)
    return data?.body.tracks?.items[0] || null
  }

  async getTrackInfo(trackId: string): Promise<SpotifyApi.TrackObjectFull> {
    const track = await this.client.getTrack(trackId)
    return track.body
  }
}

export default new SpotifyService()
