import React, { useState, useEffect } from "react";
import "./Banner.css";
import axiosRequest from "../../axiosRequest";
import requests, { getShowById } from "../../requests";
import { Link } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { translateBanner, translateLoginPage, translatePopup } from "../../translate";

function Banner({play = false, fromList = false, data, callback, show = null}) {
  const [movie, setMovie] = useState(show);
  const [stateLoaded, setStateLoaded] = useState(false)
  useEffect(() => {
    if (fromList) {
      axiosRequest
        .get(getShowById(data.id, data.type))
        .then((response) => {
          if (response) {
            if (!response.data.media_type) response.data.media_type = data.type;
            setMovie(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (!play) {
      axiosRequest
        .get(data.fetchUrl)
        .then((response) => {
          if (response) {
            let movie = null;
            do {
              movie =
                response.data.results[
                  Math.floor(Math.random() * response.data.results.length - 1)
                ];
            } while (!movie);
            setMovie(movie);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [fromList]);

  return (
    <header>
      <img
        onLoad={() => setStateLoaded(true)}
        className="img"
        src={`${requests.imgUrl}${movie?.backdrop_path}`}
        alt="Today Trending Movie"
      />
      {!stateLoaded && <div style={{height:"780px"}}/>}
      <div className="content">
        <h1>{movie?.title || movie?.name || movie?.original_name|| movie?.original_title}</h1>

        <div class="buttons">
          {!play && (
            <Link
              to={`/Play/${data?.id || movie?.id}/${
                data?.type || movie?.media_type
              }`}
            >
              <button>
                <b>{translatePopup().playButton}</b>
              </button>
            </Link>
          )}
          <button
            onClick={() => {
              callback(movie);
            }}
          >
            <b>{translateBanner().moreInfo}</b>
          </button>
        </div>
        {data.type==="tv" &&fromList&&(<LinearProgress
                      style={{width:"40%",marginTop:"10px"}}
                      variant="determinate"
                      color="secondary"
                      value={data.finished}
                    />)}
        <p class="overview">{movie?.overview}</p>
      </div>
    </header>
  );
}

export default Banner;
