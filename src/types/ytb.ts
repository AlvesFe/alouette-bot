import yts = require('yt-search')

export interface SearchResults {
  video?: yts.VideoMetadataResult
  playlist?: yts.VideoMetadataResult[]
  type: 'video' | 'playlist'
}