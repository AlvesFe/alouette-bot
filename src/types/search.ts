export enum SearchEngine {
  YTB = 'ytb',
  SPOTIFY = 'spotify'
}

export interface SearchResults {
  video?: VideoItem
  playlist?: VideoItem[]
  type: SearchType
}

export interface VideoItem {
  id: string
  title: string
  url: string
  thumbnail?: string | null
  origin: SearchEngine
  description?: string
  author?: string
}

export enum SearchType {
  Video = 'video',
  Playlist = 'playlist'
}