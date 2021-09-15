import React, { useEffect } from "react";
import Banner from "./Banner/Banner";
import Row from "./Row/Row";
import requestAPI from "../requests";

function Discover({ setPopup, title }) {
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <div style={{ backgroundColor: "#222222" }}>
      <Banner
        callback={setPopup}
        fromList={false}
        data={{ fetchUrl: requestAPI.trendingToday }}
      />
      <Row
        title="CFlix Trending"
        big={true}
        callback={setPopup}
        data={{ fetchUrl: requestAPI.trending, key: 1, url: "trending" }}
      />
      <Row
        title="TV-shows"
        callback={setPopup}
        data={{ fetchUrl: requestAPI.tv, key: 2, media_type: "tv", url: "tv" }}
      />
      <Row
        title="Movies"
        callback={setPopup}
        data={{
          fetchUrl: requestAPI.movie,
          key: 3,
          media_type: "movie",
          url: "movie",
        }}
      />
      <Row
        title="Added Recently"
        callback={setPopup}
        data={{
          fetchUrl: requestAPI.recent,
          key: 4,
          url: "recent",
        }}
        from_django
      />
    </div>
  );
}

export default Discover;
