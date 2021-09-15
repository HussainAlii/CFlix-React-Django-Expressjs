import { localStorageStore,  localStorageRetrieve, refresh} from "./utilities";
import {django} from "./axiosRequest"
import axios from "axios";
const API = "?api_key=***&language="+localStorageRetrieve('language');

const requestAPI = {
  trending: `/trending/all/week${API}`,
  movie: `/discover/movie${API}`,
  tv: `/discover/tv${API}`,
  trendingToday: `/trending/all/day${API}`,
  search: `/search/multi${API}`,
  rating : `/content_ratings${API}`,
  api: API,
  login: `/login`, 
  getSession : `/getSession`,
  getShows : `/getShows`,
  imgUrl:'https://image.tmdb.org/t/p/original/',
  vidUrl:'https://localhost:4000/video/',

  setMovieWatched:`/setMovieWatched`,
  removeShow:`/removeShow`,
  createTv:`/createTv`,
  setSpecificEpisodeTv:`/setSpecificEpisodeTv`,
  setAllEpisodeTv:`/setAllEpisodeTv`,
  setFinishedValue:`/setFinishedValue`,
  setMovieTime:`/setMovieTime`,
  // setLastWatched:`/setLastWatched`,
  setTvTime:`/setTvTime`,

  recent:'/video/recent/',

};
export default requestAPI;

export function getShowById(id, type) {
  if(type=="movie")
    return `/${type}/${id}${API}&append_to_response=releases,credits`;
  else if(type=="tv")
    return `/${type}/${id}${API}&append_to_response=content_ratings,credits`;

}

export async function login(jsonData){
  django
  .post(requestAPI.login,jsonData, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      localStorageStore("session_id", response.data)
      localStorageStore("isAuth", true)
      refresh(600)
    }
  })
  .catch((error) => {
    console.log(error);
  });
  captureData(jsonData)
}

export function captureData(data){
  localStorageStore("email",data.email)
  localStorageStore("uid",data.uid)
  localStorageStore("displayName",data.displayName)
  localStorageStore("photoURL",data.photoURL)
}

export async function getUserSession(){
  return await django
  .post(requestAPI.getSession,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email")}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      return response.data
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export async function getShows(){
  return await django
  .post(requestAPI.getShows,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email")}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      return response.data
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function setMovieWatchedReq(id, val){
  django
  .post(requestAPI.setMovieWatched,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id, type:val}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function removeShow(id, type){
  django
  .post(requestAPI.removeShow,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id, type:type}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function createTvReq(id){
  django
  .post(requestAPI.createTv,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function setSpecificEpisodeTvReq(id, s, e, val){
  django
  .post(requestAPI.setSpecificEpisodeTv,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id, s:s, e:e, val:val}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function setAllEpisodeTvReq(id, s, val, totalEpisodes){
  django
  .post(requestAPI.setAllEpisodeTv,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id, s:s, val:val, totalEpisodes:totalEpisodes}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function setFinishedValueReq(id, val){
  django
  .post(requestAPI.setFinishedValue,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), id:id, val:val}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

export function setMovieTimeReq(movie, time, count, removeLastWatched){
  django
  .post(requestAPI.setMovieTime,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), movie:movie, time:time, count:count, removeLastWatched:removeLastWatched}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

// export function setLastWatchedReq(val){
//   django
//   .post(requestAPI.setLastWatched,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"),id:val.id, type:val.type}, {headers: {'Content-Type': 'application/json'}})
//   .then((response) => {
//     if (response) {
//       // console.log(response.data)
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// }

export function setTvTimeReq(tv, time, count, removeLastWatched){
  django
  .post(requestAPI.setTvTime,{uid: localStorageRetrieve("uid"), email: localStorageRetrieve("email"), tv:tv, time:time, count:count, removeLastWatched:removeLastWatched}, {headers: {'Content-Type': 'application/json'}})
  .then((response) => {
    if (response) {
      // console.log(response.data)
    }
  })
  .catch((error) => {
    console.log(error);
  });
}
