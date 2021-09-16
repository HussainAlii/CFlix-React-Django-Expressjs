import React, { useState, useEffect, useContext} from "react";
import Banner from "../Banner/Banner";
import requestAPI from "../../requests";
import DetailsBox from "../DetailsBox/DetailsBox";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "../Box/Box";
import "./MyList.css";
import axiosRequest from "../../axiosRequest";
import {getShowById} from "../../requests";

import { UserContext } from "../../Context/userContext";
import { translateMyList } from "../../translate";

function MyList({ title, callback }) {
  const context = useContext(UserContext);

  const [tvs, setTvs] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState(-1);

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
      let tvArr = [];
      {context.tv.tv && Object.keys(context.tv.tv).map(id => {
        axiosRequest
          .get(getShowById(id, "tv"))
          .then((response) => {
            if (response) {
              tvArr.push(response.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });}
      setTvs(tvArr);
    
      return () => {
        setTvs([]);
      };


  }, [context.tv.tv]);

  useEffect(() => {
      let movieArr = [];
      {context.movie.movie && Object.keys(context.movie.movie).map(id => {
        axiosRequest
          .get(getShowById(id, "movie"))
          .then((response) => {
            if (response) {
              movieArr.push(response.data);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });}
      setMovies(movieArr);
    

      return () => {
        setMovies([]);
      };

  }, [context.movie.movie]);


  function handleTabsChange(e, val) {
    setTab(val);
  }

  return (
    <div style={{ backgroundColor: "black" }}>
      {/* show either a last watched show/movie or trending banner if not exist*/}
      {context.userInfo.userInfo?.lastWatched && context.userInfo.userInfo.lastWatched?.id ? (
        <Banner
          callback={callback.popupCallback}
          fromList={true}
          data={{
            id: context.userInfo.userInfo.lastWatched.id,
            type: context.userInfo.userInfo.lastWatched.type,
            finished: context.userInfo.userInfo.lastWatched.type == "tv"? context.tv.tv[context.userInfo.userInfo.lastWatched.id]?.finished: null,
          }}
        />
      ) : (
        <Banner
          callback={callback.popupCallback}
          fromList={false}
          data={{ fetchUrl: requestAPI.trendingToday }}
        />
      )}
      <DetailsBox />

      <div className="myList-tab" style={{ marginTop: "30px", color: "white" }}>
        {/* Tab Container */}

        <Tabs
          value={tab}
          onChange={handleTabsChange}
          centered
          // aria-label="simple tabs example"
        >
          <Tab className="tab" label={<span className="tab">{translateMyList().seriesTitle}</span>} />
          <Tab label={<span className="tab">{translateMyList().moviesTitle}</span>} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <div className="tab-container">
            <div className="tab-row">
              <h1>{translateMyList().towatch}</h1>
              {tvs &&
                tvs.map((show) => {
                  if (context.tv.tv[show.id] && context.tv.tv[show.id].finished > 0.0 && context.tv.tv[show.id].finished< 100.0) {
                    return (
                      <Box
                        show={show}
                        callback={callback.popupCallback}
                        type="tv"
                        bar
                        key={show.id}
                        barVal = {context.tv.tv[show.id].finished}
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>

            <div className="tab-row">
              <h1>{translateMyList().notStarted}</h1>
              {tvs &&
                tvs.map((show) => {
                  if (context.tv.tv[show.id] &&  context.tv.tv[show.id].finished == 0.0) {
                    return (
                      <Box
                        show={show}
                        callback={callback.popupCallback}
                        type="tv"
                        bar
                        key={show.id}
                        barVal = {context.tv.tv[show.id].finished}
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>

            <div className="tab-row">
              <h1>{translateMyList().Untilnow}</h1>
              {tvs &&
                tvs.map((show) => {
                  if (context.tv.tv[show.id] &&  context.tv.tv[show.id].finished== 100.0 && show.in_production) {
                    return (
                      <Box
                        show={show}
                        callback={callback.popupCallback}
                        type="tv"
                        bar
                        key={show.id}
                        barVal = {context.tv.tv[show.id].finished}
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>

            <div className="tab-row">
              <h1>{translateMyList().finished}</h1>
              {tvs &&
                tvs.map((show) => {
                  if (context.tv.tv[show.id] &&  context.tv.tv[show.id].finished == 100.0 && !show.in_production) {
                    return (
                      <Box
                        show={show}
                        callback={callback.popupCallback}
                        type="tv"
                        bar
                        key={show.id}
                        barVal = {context.tv.tv[show.id].finished}
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <div className="tab-container">
            <div className="tab-row">
              <h1>{translateMyList().watchedBefore}</h1>

              {movies &&
                movies.map((movie) => {
                  if (context.movie.movie[movie.id] && context.movie.movie[movie.id].watched) {
                    return (
                      <Box
                        show={movie}
                        callback={callback.popupCallback}
                        type="movie"
                        key={movie.id}
                        doEffect = "watched"
                      />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>

            <div className="tab-row">
              <h1>{translateMyList().notStarted}</h1>
              {movies &&
                movies.map((movie) => {
                  if (context.movie.movie[movie.id] && !context.movie.movie[movie.id].watched) {
                    return (
                          <Box
                          show={movie}
                          callback={callback.popupCallback}
                          type="movie"
                          key={movie.id}
                          doEffect = "notYet"
                          />
                    );
                  } else {
                    return <></>;
                  }
                })}
            </div>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

export default MyList;

function TabPanel(props) {
  const { children, value, index } = props;
  return value === index && children;
}
