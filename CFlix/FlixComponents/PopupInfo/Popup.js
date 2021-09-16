import React, { useState, useEffect, useContext } from "react";
import "./Popup.css";
import YouTube from "react-youtube";
import axiosRequest from "../../axiosRequest";
import requestAPI from "../../requests";

import error from "../Icons/error-icon.gif";
import fireworks from "../Icons/fireworks.gif";
import waiting from "../Icons/waiting.gif";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Tabs from "@material-ui/core/Tabs";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgressWithLabel from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";

import { UserContext } from "../../Context/userContext";

import {
  getRemainingDate,
  refresh,
  isReleased,
  convertTime,
} from "../../utilities";
import { Link } from "react-router-dom";

import { getShowById } from "../../requests";
import { movieStatus, translatePopup } from "../../translate";
import CrewRow from "../CrewRow/CrewRow";

function Popup({ callback, show }) {
  const context = useContext(UserContext);

  const [onModel, setOnModel] = useState(false);
  const [tab, setTab] = useState(0);

  const [rating, setRating] = useState(null)
  const [videoId, setVideoId] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [showExist, setShowExist] = useState(false);

  const [seasonCheckbox, setSeasonCheckbox] = useState({});

  const [episodes, setEpisodes] = useState(null);
  const [seasonWatched, setSeasonWatched] = useState({});
  const [cast, setCast] = useState(null);

  const opt = {
    height: "390px",
    width: "100%",
  };
  // CONTEXT,db---------------
  function isShowExist(id, type) {
    if(context[type])
      return context[type][type][id];
  }

  function isMovieWatched(id) {
    if (!context.movie.movie[id]) return false;
    return context.movie.movie[id].watched;
  }

  function toggleWatchedMovie(id, time) {
    if(!time) time = 0
    let movieCount = context.userInfo.userInfo.movieCount;
    let watchedTime = context.userInfo.userInfo.movieTime;
    if (isMovieWatched(id)) {
      //unwatch
      context.userInfo.setMovieTime({ id: showDetails.id, type: showDetails.media_type }, watchedTime - time, movieCount -1, true);
      context.movie.setMovieWatched(id, false)
    } else {
      //watch
      context.userInfo.setMovieTime({ id: showDetails.id, type: showDetails.media_type }, watchedTime + time, movieCount + 1);
      context.movie.setMovieWatched(id, true)

    }
  }

  function addRemoveShow(id, type) {
    if (isShowExist(id, type)) {
      //delete it
      setShowExist(false);

      if (type == "movie") {
        let movieCount = context.userInfo.userInfo.movieCount;

        if(isMovieWatched(showDetails.id)){
          let time = showDetails?.runtime
          if(!time) time = 0
          let watchedTime = context.userInfo.userInfo.movieTime;
          if(time)
          context.userInfo.setMovieTime({ id: id, type: type }, watchedTime - time, movieCount -1, true);
        }
        context.movie.removeMovie(id)

      } else {
        removedAllWatchedTvTime(showDetails?.episode_run_time[0])
        context.tv.removeTv(showDetails.id)
      }
    } else {
      //add it
      setShowExist(true);

      if (type == "movie") {
      context.movie.setMovieWatched(id, false)

      } else {
        context.tv.createTv(id)
      }
    }
  }

  function countWatchedPerSeason(s){
    let countWatched = 0
    let watchedSeason = context.tv.tv[showDetails.id].watched[s]
    for (let j = 0; j < showDetails.seasons[s].episode_count; j++) {
      if(watchedSeason[j+1])
        countWatched+=1
   }
   return countWatched
  }

  function removedAllWatchedTvTime(time){
    if(!time) time = 1
    let tv_time = context.userInfo.userInfo.tvTime
    let tvCount = context.userInfo.userInfo.tvCount;

    let countWatched = 0
    for (let i = 0; i < showDetails.seasons.length; i++) {
      countWatched+=countWatchedPerSeason(i)
    }
   
    let watchedTime = countWatched * time
    
    context.userInfo.setTvTime({id:show.id, type: show.media_type}, (tv_time-watchedTime),(tvCount - countWatched), true)
    
  }
  // ----------------------
  function handleTabsChange(e, val) {
    setTab(val);
  }

  function setAllEpisode(season, val, time, numOfWatched) {
    if(!time) time = 1
    let numberOfUnwatched = (episodes[season].length) - numOfWatched
    context.tv.setAllEpisodeTv(show?.id || showDetails?.id, season,val, episodes[season].length,numberOfUnwatched, numOfWatched)
    
    let tv_time = context.userInfo.userInfo.tvTime
    let tvCount = context.userInfo.userInfo.tvCount;

    if (val){ //if season true
      context.userInfo.setTvTime({id:show.id, type: show.media_type}, tv_time+(numberOfUnwatched * time),tvCount + numberOfUnwatched )
    }else{
      context.userInfo.setTvTime({id:show.id, type: show.media_type}, tv_time-(numOfWatched * time),tvCount - numOfWatched, true)
    }
      
    refreshCount();
  }

  function setSpecificEpisode(s, e, val, time) {
    if(!time) time = 0
    // console.log(`Episode ${e} of Season${s} is ${val}`);
    context.tv.setSpecificEpisodeTv(show?.id || showDetails?.id, s,e,val)
    let tv_time = context.userInfo.userInfo.tvTime
    let tvCount = context.userInfo.userInfo.tvCount;

    if (val && time){
      context.userInfo.setTvTime({ id: show.id, type: "tv" }, tv_time+time,tvCount + 1)
    }else if(time){
      context.userInfo.setTvTime({ id: show.id, type: "tv" }, tv_time-time,tvCount - 1, true)
    }

    refreshCount();
  }

  function refreshCount() {
    let userCountEpisodes = {};
    let seasonPerCheckbox = {};
    let totalWatchedEpisodes = 0;
    let totalEpisodes = 0;
    for (let i = 0; i < showDetails.seasons.length; i++) {
      let countEpisode = 0;

      for (let j = 0; j < showDetails.seasons[i].episode_count; j++) {
        if (context.tv.tv[show.id].watched[i][j + 1]) {
          countEpisode += 1;
          totalWatchedEpisodes += 1;
        }
        totalEpisodes += 1;
      }
      countEpisode === showDetails.seasons[i].episode_count
        ? (seasonPerCheckbox[i] = true)
        : (seasonPerCheckbox[i] = false);
      userCountEpisodes[i] = countEpisode;
    }
    setSeasonWatched(userCountEpisodes);
    setSeasonCheckbox(seasonPerCheckbox);
    
    context.tv.setFinishedValue(show.id, (totalWatchedEpisodes / totalEpisodes) * 100)
  }

  function setTrailerID(movies) {
    if(movies){
      let temp = null
      for(let i = 0; i<movies.results.length; i++){
        temp = movies.results[i]["key"]
        if(movies.results[i]["type"]==="Trailer" && movies.results[i]["site"]  === "YouTube")
          break
      }
      setVideoId(temp);
    }
  }

  useEffect(() => {
    let cancel;
    if (show) {
      setShowExist(isShowExist(show?.id, show?.media_type));
      axiosRequest
        .get(getShowById(show.id, show.media_type), {
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
        .then((response) => {
          if (response) {
            if (!response.data.media_type)
              response.data.media_type = show.media_type;
            setShowDetails(response.data);
            setCast(response.data.credits["cast"])
            if(show.media_type=="tv"){
              for(let i = 0; i<response.data.content_ratings.results.length; i++){
                if(response.data.content_ratings.results[i]["iso_3166_1"]=="US"){
                  setRating(response.data.content_ratings.results[i]["rating"]);
                  break
                }
              }
            }else{
              for(let i = 0; i<response.data.releases.countries.length; i++){
                if(response.data.releases.countries[i]["iso_3166_1"]=="US"){
                  setRating(response.data.releases.countries[i]["certification"]);
                  break
                }
              }
            }

          }
        })
        .then(() => {
              axiosRequest
              .get(`/${show.media_type}/${show.id}/videos?api_key=***`, {
              cancelToken: new axios.CancelToken((c) => (cancel = c)),
            })
            .then((response) => {
              setTrailerID(response.data)
            })
            .catch((error) => {
              console.log(error);
            });

        })
        .catch((error) => {
          console.log(error);
        });

        return () => {
          setEpisodes(null);
          setRating(null)
          setVideoId(null)
          setSeasonWatched({})
          setShowDetails(null);
          setShowExist(false);
          setSeasonCheckbox({});
          setCast(null)
          setTab(0);
          cancel();
        };
    }
  }, [show]);

  useEffect(() => {
    if (
      !episodes &&
      showExist &&
      showDetails &&
      showDetails?.media_type == "tv"
    ) {
      let episodesList = [];
      let promises = [];
      showDetails.seasons.map((season) => {
        promises.push(
          axiosRequest.get(
            `/tv/${showDetails.id}/season/${season.season_number}${requestAPI.api}`
          )
        );
      });

      Promise.all(promises)
        .then((responses) => {
          responses.map((response) => {
            episodesList.push(response.data.episodes);
          });
        })
        .catch((error) => {
          console.log(error);
        });

      setEpisodes(episodesList);
    }
  }, [showExist, showDetails, episodes]);

  useEffect(() => {
    if (showExist && episodes && showDetails &&context.tv.tv[show.id].watched) {
      let userEpisodes = [];
      let userCountEpisodes = {};
      let seasonPerCheckbox = {};
      let totalWatchedEpisodes = 0;
      let totalEpisodes = 0;

      for (let i = 0; i < showDetails.seasons.length; i++) {
        let season = {};
        let countEpisode = 0;
        for (let j = 0; j < showDetails.seasons[i].episode_count; j++) {
          season[j + 1] = context.tv.tv[show.id].watched[i]
            ? context.tv.tv[show.id].watched[i][j + 1]
              ? context.tv.tv[show.id].watched[i][j + 1]
              : false
            : false;
          if (season[j + 1]) {
            countEpisode += 1;
            totalWatchedEpisodes += 1;
          }
          totalEpisodes += 1;
        }

        countEpisode === showDetails.seasons[i].episode_count
          ? (seasonPerCheckbox[i] = true)
          : (seasonPerCheckbox[i] = false);
        userCountEpisodes[i] = countEpisode;
        userEpisodes.push(season);
      }
      setSeasonWatched(userCountEpisodes);
      setSeasonCheckbox(seasonPerCheckbox);
      context.tv.setFinishedValue(show.id,(totalWatchedEpisodes / totalEpisodes) * 100)
      context.tv.setWatchedTv(show.id,userEpisodes )
    }
  }, [showDetails, episodes, showExist]);

  if (show) {
    return (
      <div
        style={{ zIndex: "11" }}
        onClick={() => {
          if (!onModel) callback(null);
        }}
        className="overlay "
      >
        <div
          onMouseLeave={() => {
            setOnModel(false);
          }}
          onMouseOver={() => {
            setOnModel(true);
          }}
          style={{ zIndex: "20" }}
          className="model-popup"
        >
          {(videoId && <YouTube videoId={videoId} opts={opt} />) || (
            <div className="Error">
              <img className="img" src={error} alt="error" />
              <p>Trailer Not found!</p>
            </div>
          )}
          {
            <div class="popup-content">
              <Grid container>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <a href={showDetails?.homepage}>
                    <LazyLoadImage
                      key={show.id}
                      className="movieImg"
                      alt={show?.title || show?.name || show?.original_name|| show?.original_title}
                      src={`${requestAPI.imgUrl}${show.poster_path}`}
                      effect="blur"
                    />
                  </a>

                  {showExist && showDetails && showDetails.media_type == "tv" && (
                    <>
                      <LinearProgress
                        variant="determinate"
                        color="secondary"
                        value={context.tv.tv[showDetails.id]?.finished}
                      />
                      {context.tv.tv[show.id].finished === 100 &&
                        (showDetails?.in_production ? (
                          <div className="leftBottomContainer">
                            <img src={waiting} style={{ width: "200px" }} />
                            <p style={{ fontSize: "25px", fontWeight: "800" }}>
                              &#9203; {translatePopup().tobecontinue}
                            </p>
                          </div>
                        ) : (
                          <div className="leftBottomContainer">
                            <img src={fireworks} style={{ width: "200px" }} />
                            <p className="centeredText">
                              &#127937; {translatePopup().thatIsAll}
                            </p>
                          </div>
                        ))}
                    </>
                  )}
                </Grid>
                <Grid container xs={9} sm={9} md={9} lg={9} xl={9}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div class="popup-content-info">
                      <h5 style={{ display: "inline-block" }}>
                        {show?.title || show?.original_title || show?.name || show?.original_name}
                        {` (${show?.release_date || show?.first_air_date})`}
                      </h5>
                      {showDetails && (
                        <p
                          style={{
                            display: "inline-block",
                            marginLeft: "10px",
                            fontSize: "17px",
                          }}
                        >
                          {showDetails.media_type == "tv" &&
                            (showDetails?.in_production ? translatePopup().production[0]:translatePopup().production[1])}
                          {showDetails.media_type == "movie" &&
                            (showDetails?.status
                              ? movieStatus(showDetails.status)
                              : "")}
                        </p>
                      )}
                      <hr />
                      <p className="popup-content-info-overview">
                        {show?.overview}
                      </p>
                    </div>
                  </Grid>
                  <Grid container xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <div class="popup-content-control">
                        <div class="buttons popup-content-buttons">
                          <Link
                            to={`/Play/${show?.id || showDetails?.id}/${
                              show?.media_type || showDetails?.media_type
                            }`}
                            onClick={() => {
                              refresh(500);
                            }}
                          >
                            <button>
                              <b>{translatePopup().playButton}</b>
                            </button>
                          </Link>
                          <button
                            className={showExist ? "removeButton" : "addButton"}
                            onClick={() => {
                              addRemoveShow(
                                show?.id || showDetails?.id,
                                show?.media_type || showDetails?.media_type
                              );
                            }}
                          >
                            <b>{showExist ? translatePopup().addRemoveButton[0] :  translatePopup().addRemoveButton[1]}</b>
                          </button>
                          {showExist &&
                          showDetails &&
                          showDetails.media_type == "movie" ? (
                            <>
                              <b>
                                {isMovieWatched(show.id)
                                  ? translatePopup().watched[1]
                                  : translatePopup().watched[0]}
                              </b>
                              <Checkbox
                                color="secondary"
                                checked={isMovieWatched(show.id)}
                                icon={<CircleUnchecked />}
                                checkedIcon={<CircleCheckedFilled />}
                                size="medium"
                                onChange={() => {
                                  toggleWatchedMovie(
                                    show?.id,
                                    showDetails?.runtime
                                  );
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div class="popup-content-rate">
                          {/* ------------------------------ */}
                          <Box position="relative">
                            <CircularProgressWithLabel
                              thickness={4}
                              variant="static"
                              color="secondary"
                              size={50}
                              value={
                                showDetails && showDetails.vote_average * 10
                              }
                            />
                            <Box
                              top={0}
                              left={0}
                              bottom={
                                showExist &&
                                showDetails &&
                                showDetails.media_type == "movie"
                                  ? 20
                                  : 7
                              }
                              right={0}
                              position="absolute"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Typography variant="caption" color="white">
                                {showDetails &&
                                  `${Math.round(
                                    showDetails.vote_average * 10
                                  )}%`}
                              </Typography>
                            </Box>
                          </Box>
                          <p>({showDetails && showDetails.vote_count})</p>
                          {showDetails && rating &&<p style={{marginLeft:"20px"}}> * ({rating})</p>}
                        </div>
                      </div>
                      <hr style={{ marginLeft: "15px", marginRight: "15px" }} />
                    </Grid>
                  </Grid>
                  <Grid container xs={12} sm={12} md={12} lg={12} xl={12}>
                    {/* Tab Container */}
                    <div
                      style={{ marginLeft: "15px", marginRight: "100%" }}
                      position="static"
                    >
                      <Tabs
                        value={tab}
                        onChange={handleTabsChange}
                        // aria-label="simple tabs example"
                      >
                        <Tab
                          className="tab"
                          label={<span className="tab">{translatePopup().aboutTab}</span>}
                        />
                        {showExist &&
                          showDetails &&
                          showDetails.media_type == "tv" && (
                            <Tab label={<span className="tab">{translatePopup().episodeTab}</span>} />
                          )}
                      </Tabs>
                    </div>
                    <TabPanel value={tab} index={0}>
                      <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                        <div
                          class="popup-content-info"
                        >
                          <p className="additional"> {translatePopup().Genres} </p>
                          <ul>
                            {showDetails && showDetails?.genres &&
                              showDetails?.genres.map((genre) => (
                                <li>
                                  <p>{genre.name}</p>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </Grid>
                      {show &&
                        showDetails &&
                        showDetails.media_type == "movie" && (
                          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                            <div
                              class="popup-content-info"
                              style ={{paddingLeft:"10%"}}
                            >
                              <p className="additional">{translatePopup().general}</p>
                              <ul>
                                <li>
                                  <p>{`${translatePopup().movie_runtime} ${
                                    convertTime(showDetails.runtime)["h"]
                                  } ${translatePopup().movie_hour} ${
                                    convertTime(showDetails.runtime)["min"]
                                  } ${translatePopup().movie_min}`}</p>
                                </li>
                                {showDetails.budget?
                                 <li>
                                  {translatePopup().cost} {showDetails.budget} $
                                </li>:<></>}

                              </ul>
                            </div>
                          </Grid>
                        )}
                      {showDetails && showDetails.media_type == "tv" && (
                        <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                          <div
                            class="popup-content-info"
                          >
                            <p className="additional">{translatePopup().dates}</p>
                            <ul style={{ listStyleType: "square" }}>
                              {showDetails?.first_air_date && (
                                <li>
                                  <p>{showDetails.first_air_date} : {translatePopup().first_episode}</p>
                                </li>
                              )}

                              {showDetails?.last_air_date && (
                                <li>
                                  <p>
                                    {showDetails.last_air_date} : {translatePopup().last_episode}
                                    
                                  </p>
                                </li>
                              )}

                              {showDetails?.next_episode_to_air && (
                                <li>
                                  <p>
                                    {`${translatePopup().next_episode_to_air} ${
                                      showDetails.next_episode_to_air
                                        .episode_number
                                    } ${translatePopup().season} ${
                                      showDetails.next_episode_to_air
                                        .season_number
                                    } : ${getRemainingDate(
                                      showDetails.next_episode_to_air.air_date
                                    )} ${translatePopup().day}`}
                                  </p>
                                </li>
                              )}
                            </ul>
                          </div>
                        </Grid>
                      )}
                      {showDetails && showDetails.media_type == "tv" && (
                        <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                          <div
                            style={{marginRight: "30px" }}
                            class="popup-content-info"
                          >
                            <p className="additional">{translatePopup().numbers}</p>
                            <ul style={{ listStyleType: "square" }}>
                              {showDetails?.number_of_episodes && (
                                <li>
                                  <p>
                                  {translatePopup().totalEpisodes} {showDetails.number_of_episodes}
                                  </p>
                                </li>
                              )}

                              {showDetails?.number_of_seasons && (
                                <li>
                                  <p>
                                    {translatePopup().totalSeasons} {showDetails.number_of_seasons}
                                  </p>
                                </li>
                              )}

                              {showDetails?.episode_run_time && (
                                <li>
                                  <p>
                                    {translatePopup().tvRuntime}
                                    {showDetails?.episode_run_time[0]} {translatePopup().movie_min}
                                  </p>
                                </li>
                              )}
                            </ul>
                          </div>
                        </Grid>
                      )}

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <CrewRow data={cast} />
                    </Grid>

                    </TabPanel>
                    {showExist &&
                      showDetails &&
                      showDetails.media_type == "tv" &&
                      episodes &&
                      context.tv.tv[show.id] && (
                        <TabPanel value={tab} index={1}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{ margin: "10px", color: "white" }}>
                              {showDetails.seasons.map((season, index) => {
                                return (
                                  <Accordion className="accordion">
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                    >
                                      <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={(event) =>
                                          event.stopPropagation()
                                        }
                                        onFocus={(event) =>
                                          event.stopPropagation()
                                        }
                                        control={
                                          <Checkbox
                                            color="secondary"
                                            checked={seasonCheckbox[index]}
                                            onChange={(e) => {
                                              let checked = e.target.checked;
                                              let sCheckbox = seasonCheckbox;
                                              sCheckbox[index] = !checked;
                                              setSeasonCheckbox(sCheckbox);

                                              let numOfWatched = 0
                                              episodes[index].map(
                                                (episode, episodeIndex) => {
                                                  let tempTv = context.tv.tv[show.id];
                                                  context.tv.setTv({...context.tv.tv,[show.id]: {...tempTv,watched:
                                                     context.tv.tv[show.id].watched.map((watched,watchedIndex) => {
                                                          if (watchedIndex ==index) {
                                                            if(watched[episodeIndex + 1]) numOfWatched+=1
                                                            watched[episodeIndex + 1] = checked;
                                                          }
                                                          return watched;
                                                        }
                                                      ),
                                                    },
                                                  });
                                                }
                                              );
                                              setAllEpisode(index, checked,showDetails?.episode_run_time[0], numOfWatched);
                                            }}
                                          />
                                        }
                                      />
                                      <div className="summary">
                                        <div className="upper">
                                          <p className="items">
                                            {seasonWatched[index]}/
                                            {season.episode_count}
                                          </p>
                                          <p className="items right-accordion">{`${
                                            season.name
                                          } - (${season.air_date.slice(
                                            0,
                                            4
                                          )})`}</p>
                                          <a
                                            target="_blank"
                                            href={`${requestAPI.imgUrl}${season.poster_path}`}
                                          >
                                            <LazyLoadImage
                                              key={season.id}
                                              className="smImg"
                                              src={`${requestAPI.imgUrl}${season.poster_path}`}
                                              effect="blur"
                                            />
                                          </a>
                                        </div>
                                        <div className="bottom">
                                          <LinearProgress
                                            variant="determinate"
                                            color="secondary"
                                            value={
                                              (seasonWatched[index] /
                                                season.episode_count) *
                                              100
                                            }
                                          />
                                        </div>
                                      </div>
                                    </AccordionSummary>
                                    {episodes[index]?.map(
                                      (episode, keyIndex) => {
                                        return (
                                          <div>
                                            <hr />
                                            <AccordionDetails>
                                              <div className="details">
                                                {!isReleased(
                                                  episode.air_date
                                                ) && (
                                                  <div
                                                    style={{
                                                      marginTop: "8px",
                                                    }}
                                                    position="relative"
                                                  >
                                                    <p>
                                                      {episode.air_date
                                                        ? `${translatePopup().day} ${getRemainingDate(
                                                            episode.air_date
                                                          )}`
                                                        : translatePopup().discussion}
                                                    </p>
                                                  </div>
                                                )}
                                                <Checkbox
                                                  color="secondary"
                                                  value={[
                                                    index + 1,
                                                    keyIndex + 1,
                                                  ]}
                                                  icon={<CircleUnchecked />}
                                                  checkedIcon={
                                                    <CircleCheckedFilled />
                                                  }
                                                  checked={
                                                    context.tv.tv[show.id]
                                                      .watched[index] && context.tv.tv[show.id]
                                                      .watched[index][
                                                      keyIndex + 1
                                                    ] || false
                                                  }
                                                  onChange={(e) => {
                                                    let checked =
                                                      e.target.checked;
                                                    let tempTv =
                                                      context.tv.tv[show.id];
                                                    context.tv.setTv({...context.tv.tv,[show.id]: {...tempTv,watched: context.tv.tv[show.id].watched.map(
                                                          (watched,watchedIndex) => {
                                                            if (watchedIndex ==e.target.value[0] - 1) {
                                                              watched[keyIndex + 1] = checked;
                                                            }
                                                            return watched;
                                                          }
                                                        ),
                                                      },
                                                    });

                                                    setSpecificEpisode(
                                                      index,
                                                      keyIndex + 1,
                                                      checked,
                                                      showDetails?.episode_run_time[0]
                                                    );


                                                  }}
                                                  size="medium"
                                                />

                                                <Box
                                                  style={{
                                                    marginTop: "15px",
                                                  }}
                                                  position="relative"
                                                >
                                                  <CircularProgressWithLabel
                                                    thickness={4}
                                                    variant="static"
                                                    color="secondary"
                                                    size={50}
                                                    value={
                                                      episode.vote_average * 10
                                                    }
                                                  />
                                                  <Box
                                                    top={0}
                                                    left={0}
                                                    bottom={17}
                                                    right={0}
                                                    position="absolute"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                  >
                                                    <Typography
                                                      variant="caption"
                                                      color="white"
                                                    >{`${Math.round(
                                                      episode.vote_average * 10
                                                    )}%`}</Typography>
                                                  </Box>
                                                  <Box
                                                    top={70}
                                                    left={0}
                                                    bottom={0}
                                                    right={0}
                                                    position="absolute"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                  >
                                                    <Typography
                                                      variant="caption"
                                                      color="white"
                                                    >
                                                      ({episode.vote_count})
                                                    </Typography>
                                                  </Box>
                                                </Box>

                                                <div className="right-accordion itemsDetails">
                                                  <p
                                                    style={{
                                                      direction: "rtl",
                                                    }}
                                                  >
                                                    S{episode.season_number} | E
                                                    {episode.episode_number}
                                                  </p>
                                                  <p>{episode.name}</p>
                                                </div>
                                                <a
                                                  target="_blank"
                                                  href={`${requestAPI.imgUrl}${episode.still_path}`}
                                                >
                                                  <LazyLoadImage
                                                    key={episode.id}
                                                    className={
                                                      episode.still_path
                                                        ? "smDetailsImg"
                                                        : "smImg"
                                                    }
                                                    src={`${requestAPI.imgUrl}${
                                                      episode?.still_path ||
                                                      season.poster_path
                                                    }`}
                                                    effect="blur"
                                                  />
                                                </a>
                                              </div>
                                            </AccordionDetails>
                                          </div>
                                        );
                                      }
                                    )}
                                  </Accordion>
                                );
                              })}
                            </div>
                          </Grid>
                        </TabPanel>
                      )}
                    {/* Tab Container */}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          }
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

export default Popup;

function TabPanel(props) {
  const { children, value, index } = props;
  return value === index && children;
}
