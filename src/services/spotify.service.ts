import Spotify from 'spotify-web-api-node'
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env

class SpotifyService {
  private readonly client = new Spotify({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_SECRET
  })

  async auth(): Promise<void> {
    const data = await this.client.clientCredentialsGrant()
    this.client.setAccessToken(data.body.access_token)
  }

  async searchTrack(query: string): Promise<SpotifyApi.TrackObjectFull | null> {
    await this.auth()
    const data = await this.client.searchTracks(query)
    return data?.body.tracks?.items[0] || null
  }

  async getTrackInfo(trackId: string): Promise<SpotifyApi.TrackObjectFull> {
    await this.auth()
    const track = await this.client.getTrack(trackId)
    return track.body
  }

  async getPlaylistInfo(playlistId: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
    await this.auth()
    const playlist = await this.client.getPlaylist(playlistId)
    return playlist.body.tracks.items
  }

  async getEpisodeInfo(episodeId: string): Promise<SpotifyApi.EpisodeObjectFull> {
    await this.auth()
    const episode = await this.client.getEpisode(episodeId)
    return episode.body
  }

  async getAlbumInfo(albumId: string): Promise<SpotifyApi.TrackObjectSimplified[]> {
    await this.auth()
    const album = await this.client.getAlbum(albumId)
    return album.body.tracks.items
  }

  async getArtistTracks(artistId: string): Promise<SpotifyApi.TrackObjectFull[]> {
    await this.auth()
    const artist = await this.client.getArtistTopTracks(artistId, 'US')
    return artist.body.tracks
  }
}

export default new SpotifyService()
