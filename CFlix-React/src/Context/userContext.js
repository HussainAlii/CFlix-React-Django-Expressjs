import React, { useState, useEffect, createContext,useContext } from "react";
import { getGuestData } from "../FlixComponents/localData/localData";
import { isGuest, localStorageRetrieve, localStorageStore, logout, timeout } from "../utilities";
import {createTvReq, getShows, getUserSession, removeShow, setAllEpisodeTvReq, setFinishedValueReq, setMovieTimeReq, setMovieWatchedReq, setSpecificEpisodeTvReq, setTvTimeReq} from "../requests"
export const UserContext = createContext();

function UserContextProvider({ children }) {
  
    const [notification, setNotification] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [movie, setMovie] = useState(null)
    const [tv, setTv] = useState(null)
    
      // console.log({notification:{notification,setNotification},userInfo:{userInfo,setUserInfo},movie:{movie,setMovie},tv:{tv,setTv},setUser})
    
    function setUser(data){
      setNotification(data?.notification || [])

      setUserInfo({
        uid:data?.uid || "guest",
        displayName:data?.displayName || "guest",
        lastWatched: data?.lastWatched || null,
        tvTime: data?.tvTime || 0,
        tvCount: data?.tvCount || 0,
        movieTime: data?.movieTime || 0,
        movieCount: data?.movieCount || 0,
      })

      setMovie(data?.movie || {})
      setTv(data?.tv || {})
    }

    function loadUserData(data){
      setUserInfo({...userInfo,
         lastWatched:data?.lastWatched|| null,
         tvTime: data?.tvTime || 0,
         tvCount: data?.tvCount || 0,
         movieTime: data?.movieTime || 0,
         movieCount: data?.movieCount || 0,
         photoURL : localStorageRetrieve("photoURL"),
         displayName : localStorageRetrieve("displayName"),
        })
      setMovie(data?.movie || {})
      setTv(data?.tv || {})
    }

    
    useEffect(async () => {
      if(localStorageRetrieve("isAuth")){
        if(isGuest()){
          loadGuestData()
        }else{
          let data = {uid:localStorageRetrieve("uid") , email:localStorageRetrieve("email"), displayName:localStorageRetrieve("displayName"),photoURL:localStorageRetrieve("photoURL"), session_id: localStorageRetrieve("session_id") }
          setUser(data)
          if(localStorageRetrieve('session_id') != await getUserSession()) // do auth
            logout() 
          let shows = await getShows()
          loadUserData(shows)
        }
      }
    },[]);

      function loadGuestData(){
        let data = getGuestData()
        setUser(data)
      }

      // function pushNotification(data){
      //   setNotification(oldArray => [...oldArray, data])
      //   if(isGuest()){
      //     localStorageStore("notification",notification)
      //   }else{ //save to db

      //   }
      // }

      //movie
      function setMovieWatched(id, val){
        setMovie({ //update ui
          ...movie,
          [id]: { watched: val },
        });

        if(isGuest()){ //update local
          movie[id]? movie[id].watched=val : movie[id]= { watched: val } 
          localStorageStore("movie",movie)
        }else{ //update db
          setMovieWatchedReq(id, val)
        }
      }

      function removeMovie(id){
        let temp = {...movie}
        delete temp[id]
        setMovie(temp)

        if(isGuest()){ //update local
          localStorageStore("movie",temp)
        }else{ //update db
          removeShow(id, "movie")
        }
      }

      //tv 
      function removeTv(id){
        let temp = {...tv}
        delete temp[id]
        setTv(temp)
        if(isGuest()){
          localStorageStore("tv",temp)
        }else{ //save to db
          removeShow(id, "tv")
        } 
      }

      function createTv(id){
        setTv({
          ...tv,
          [id]: { watched: [], finished: 0 },
        });

        if(isGuest()){
          tv[id] = { watched: [], finished: 0 }
          localStorageStore("tv",tv)
        }else{ //save to db
          createTvReq(id)
        }
      }

      function setSpecificEpisodeTv(id, s, e, val){
        if(!isGuest()){ //save to db
          setSpecificEpisodeTvReq(id, s,e,val)
        }
      }

      function setAllEpisodeTv(id, s,val, totalEpisodes){
        if(!isGuest()){//save to db
          setAllEpisodeTvReq(id, s, val, totalEpisodes)
        }
      }

      function setFinishedValue(id, val){
        setTv({
          ...tv,
          [id]: {
            ...tv[id],
            finished: val,
          },
        });

        if(isGuest()){
          tv[id].finished=val
          localStorageStore("tv",tv)
        }else{ //save to db
          setFinishedValueReq(id,val)
        }
      }
      
      function setWatchedTv(id, userEpisodes){
        setTv({
          ...tv,
          [id]: {
            ...tv[id],
            watched: userEpisodes,
          }
        });

        if(isGuest()){
          tv[id].watched=userEpisodes
          localStorageStore("tv",tv)
        }
      }

      //user Info
      function setMovieTime(movie, time, count, removeLastWatched= false){
        if(removeLastWatched){
          setUserInfo({
            ...userInfo,
            lastWatched: null,
            movieTime: time,
            movieCount: count,
          });
        }else{ //add
          setUserInfo({
            ...userInfo,
            lastWatched: movie,
            movieTime: time,
            movieCount: count,
          });
        }
  

        if(isGuest()){
          localStorageStore("movieTime",time)
          localStorageStore("movieCount",count)
          removeLastWatched? localStorageStore("lastWatched",null): localStorageStore("lastWatched",movie)
        }else{ //save to db
          setMovieTimeReq(movie, time, count, removeLastWatched)
        }
      }

      // function setLastWatched(val){
      //   setUserInfo({
      //     ...userInfo,
      //   lastWatched: val
      //   });

      //   if(isGuest()){
      //     localStorageStore("lastWatched",val)
      //   }else{ //save to db
      //     setLastWatchedReq(val)
      //   }

      // }

      function setTvTime(tv, time, count, removeLastWatched = false){
        if (removeLastWatched){
          if (count !=null)
          setUserInfo({
            ...userInfo,
            lastWatched: null,
            tvTime: time,
            tvCount: count
          });
        else
          setUserInfo({
            ...userInfo,
            lastWatched: null,
            tvTime: time,
          });
        }else{ //add

          if (count !=null)
          setUserInfo({
            ...userInfo,
            lastWatched: tv,
            tvTime: time,
            tvCount: count
          });
        else
          setUserInfo({
            ...userInfo,
            lastWatched: tv,
            tvTime: time,
          });
        }
        

        if(isGuest()){
          localStorageStore("tvTime",time)
          count !=null && localStorageStore("tvCount",count) 
          removeLastWatched? localStorageStore("lastWatched",null) :  localStorageStore("lastWatched",tv)

        }else{ //save to db
          setTvTimeReq(tv, time, count, removeLastWatched)
        }
      }

      return (
        <UserContext.Provider value={{notification:{notification,setNotification,},userInfo:{userInfo,setTvTime,setMovieTime},movie:{movie,setMovieWatched,removeMovie},tv:{tv,setTv,setAllEpisodeTv,setSpecificEpisodeTv,createTv,removeTv,setFinishedValue, setWatchedTv}, setUser,loadGuestData}}>
            { children }
        </UserContext.Provider>
    )
}

export default UserContextProvider

