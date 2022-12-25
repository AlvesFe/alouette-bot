import ytpl = require('ytpl')
import ytsr = require('ytsr')

export interface SearchResults {
  video?: ytsr.Video
  playlist?: PlaylistItem[]
  type: 'video' | 'playlist'
}

export interface PlaylistItem extends ytpl.Item {}