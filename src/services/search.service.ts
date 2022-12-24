import { SearchEngine } from '../types/search'
import { SearchResults } from '../types/ytb'
import spotifyService from './spotify.service'
import ytbService from './ytb.service'

const SPOTIFY_HOSTNAMES = ['open.spotify.com', 'spotify.com']
const { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } = process.env

class SearchService {
  async search(query: string): Promise<SearchResults> {
    try {
      const parsedQuery = new URL(query)
      const searchEngine = this.defineSearchEngine(parsedQuery)
      const searchResults = await this.getVideoInfo(query, searchEngine)
      if (!searchResults) {
        throw new Error('Não foi possível encontrar a música informada!')
      }
      return searchResults
    } catch {
      return await ytbService.search(query)
    }
  }

  defineSearchEngine(query: URL): string {
    if (SPOTIFY_HOSTNAMES.includes(query.hostname) && (SPOTIFY_CLIENT_ID && SPOTIFY_SECRET)) {
      return SearchEngine.SPOTIFY
    }
    console.info('Spotify not configured, using YTB as default search engine')
    return SearchEngine.YTB
  }

  async getVideoInfo(query: string, type: string): Promise<SearchResults> {
    switch (type) {
      case SearchEngine.SPOTIFY:
        return await spotifyService.search(query)
      default:
        return await ytbService.search(query)
    }
  }
}

export default new SearchService()
