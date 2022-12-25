import ytpl = require('ytpl')
import ytsr = require('ytsr')

export interface SearchResults {
  video?: ytsr.Video
  playlist?: PlaylistItem[]
  type: SearchType
}

export type PlaylistItem = ytpl.Item

export enum SearchType {
  Video = 'video',
  Playlist = 'playlist'
}
