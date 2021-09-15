import React, {useRef,useState} from "react";
import "./Box.css";
import LinearProgress from "@material-ui/core/LinearProgress";
import loading from "../Icons/loading.gif"
import requests from "../../requests";

function Box({ show, big, callback, type, bar= false,barVal, doEffect = false, from_django=null }) {
  if (show.media_type == null) show.media_type = type;
  if (from_django) show.media_type = from_django.type;
  const [stateLoaded, setStateLoaded] = useState(false)
  return (
    <div
      onClick={() => {
        callback(show);
      }}
      className={`box`}
    >
      <img
        style={stateLoaded ? (big?{height:"380px",width:"266.5px"}:{height:"320px",width:"240px"}) : {display: 'none'}}
        onLoad={() => setStateLoaded(true)}
        key={show.id}
        className={`posterImg ${doEffect && (doEffect)}`}
        height={`${big ? "380px" : "300px"}`}
        
        alt={show.name}
        src={`${requests.imgUrl}${show.poster_path}`}
      /> 
      {!stateLoaded && <img src={loading} style={{height:"310px",width: "240px"}}/>}
      
      {bar&& <LinearProgress
        variant="determinate"
        color={barVal==100?"primary":"secondary"}
        value={barVal}
      />}

      {from_django&&<div>
        <b className="boxinfo">{show?.title || show?.original_title || show?.name || show?.original_name}</b>
        <b className="boxinfo">-{from_django.quality}</b>
        {from_django.season&&<b className="boxinfo">-S{from_django.season}</b>}
        {from_django.episode&&<b className="boxinfo">-E{from_django.episode}</b>}
        </div>}

    </div>
  );
}

export default Box;
