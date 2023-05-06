import internal from 'stream'
import { exec } from 'youtube-dl-exec'
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
    const stream = exec(
      url,
      {
        output: '-',
        format: 'bestaudio',
        limitRate: '1M',
        rmCacheDir: true,
        verbose: true,
      },
      {
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )
    stream.unref()
    stream.on('error', (error) => {
      console.error('Error on stream', error)
    })
    if (!stream.stdout) throw new Error('No stream')
    return stream.stdout
  }
}

export default new YtbService()