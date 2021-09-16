import {localStorageRetrieve} from "../../utilities"

  export function getGuestData(){
    let data = {}
    data.lastWatched = localStorageRetrieve("lastWatched")
    data.tvTime = localStorageRetrieve("tvTime")
    data.tvCount = localStorageRetrieve("tvCount")
    data.movieTime = localStorageRetrieve("movieTime")
    data.movieCount = localStorageRetrieve("movieCount")
    data.movie = localStorageRetrieve("movie")
    data.tv = localStorageRetrieve("tv")
    return data
  }

  