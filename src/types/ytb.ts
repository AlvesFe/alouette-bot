import yts = require('yt-search')

export interface SearchResults {
  video?: yts.VideoMetadataResult
  playlist?: PlaylistItem[]
  type: 'video' | 'playlist'
}

export interface PlaylistItem extends yts.PlaylistItem {
  url: string
  description: string
}