import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from 'react-player'
import Banner from "../Banner/Banner";
import requestAPI, { getShowById } from "../../requests";
import axiosRequest, { django } from "../../axiosRequest";
import { useParams } from "react-router";
import error from "../Icons/error-icon.gif";
import checked from "../Icons/checked.gif";
import "./Play.css"
import { UserContext } from "../../Context/userContext";

function Play({ title, callback }) {
  const context = useContext(UserContext);
  const { id, type } = useParams();
  const [show, setShow] = useState(null);
  const [info, setInfo] = useState(null);
  const [duration, setDuration] = useState(0)
  const [playedTime, setPlayedTime] = useState(0)
  const [watched, setWatched] = useState(false)
  
  useEffect(() => {
    if(duration && playedTime && playedTime>duration && !watched){
      let movieCount = context.userInfo.userInfo.movieCount;
      let watchedTime = context.userInfo.userInfo.movieTime;
      let time = show?.runtime || 0
      
      context.movie.setMovieWatched(id, true)
      context.userInfo.setMovieTime({ id: id, type: type }, watchedTime + time, movieCount + 1)

      setWatched(true)
    }
  },[playedTime])

  useEffect(() => {
    document.title = title;
    callback.popupCallback(false);

    axiosRequest
      .get(getShowById(id, type))
      .then((response) => {
        if (response) {
          if (!response.data.media_type) response.data.media_type = type;
          setShow(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    django
      .get(`video/${id}/`)
      .then((response) => {
        if (response) {
          setInfo(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // console.log(show);
  return (
    <>
      {show && (
        <Banner
          callback={callback.popupCallback}
          play
          data={{ id: id, type: type }}
          show={show}
        />
      )}

      {info?
      <div className="video-container">
        <ReactPlayer
         width={"100%"} height="auto"
        controls
        pip = {true}
        stopOnUnmount={false}
        url={`${requestAPI.vidUrl}${id}`}
        type="video/mp4"
        onProgress = {(e)=>{setPlayedTime(e.playedSeconds)}}
        onDuration = {(e)=>{setDuration(e/1.3)}}
         />
        <div className="info" >
          {watched && 
          <div className="check-container">
          <img className="checkImg" src={checked} />
          <b>This Movie has been marked as Watched</b>
          </div>
        }
          <b>Quality: {info.quality}</b>
          <b>This is not a real Movie/TV, It's only for testing purposes.</b>
        </div>
      </div>
      :<div className="Error">
        <img style={{}} className="img" src={error} alt="error" />
        <p style={{color:"white"}} >Sorry about that, The Video is not available!</p>
      </div>}
    </>
  );
}

export default Play;
