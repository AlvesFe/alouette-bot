import internal from 'stream'
import ytdl from 'ytdl-core'
import ytpl from 'ytpl'
import ytsr from 'ytsr'

class YtbService {
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
      quality: 'highestaudio',
      highWaterMark: 1048576 * 32
    }).on('error', console.error)
  }
}

export default new YtbService()