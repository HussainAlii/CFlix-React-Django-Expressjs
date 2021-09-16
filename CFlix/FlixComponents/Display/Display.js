import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Banner from "../Banner/Banner";
import requestAPI, { getShowById } from "../../requests";
import "./Display.css";
import axiosRequest, { django } from "../../axiosRequest";
import Box from "../Box/Box";
import InfiniteScroll from "react-infinite-scroll-component";

function Display({ setPopup, title }) {
  const { type } = useParams();
  const [tv, setTV] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  async function updateShowList(list) {
    setTV([...tv,...list]);
  }

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    if(type==="recent"){
      django
      .get(`${requestAPI[type]}${page}/`)
      .then(async (response) => {
        for(let i=0;i<response.data?.length;i++){
          let django_data = response.data[i]
          axiosRequest
          .get(getShowById(django_data.vid, django_data.type))
          .then(async (res) => {
              if(res.data){
                res.data["media_type"]= django_data.type
                updateShowList([res.data]);
                }
          })
          .catch((error) => {
            console.log(error);
          });
          
        }
        response.data == null && setHasMore(false)
      })
      .catch((error) => {
        console.log(error);
        setHasMore(false)
      });

    }else{
      axiosRequest
      .get(`${requestAPI[type]}&page=${page}`)
      .then((response) => {
        setTimeout(
          function () {
            updateShowList(response.data.results);
          }.bind(this),
          1250
        );

        response.data == null && setHasMore(false)
      })
      .catch((error) => {
        console.log(error);
        setHasMore(false)
      });
    }
  }, [page]);

  return (
    <>
      <Banner
        callback={setPopup}
        fromList={false}
        data={{ fetchUrl: requestAPI.trendingToday }}
      />
      <div className="display-container">
        <h1>
          More {type == "movie" ? "Movies" : type == "tv" ? "Tv-Shows" : type}
          ...
        </h1>
        <InfiniteScroll
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: "center", color:"white" }}>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center", color:"white" }}>
              <b>هذا كل شي!</b>
            </p>
          }
          dataLength={tv.length}
          next={() => {
            setPage(page + 1);
          }}
        >
          {tv.map((show) =>
            show.poster_path ? (
              <Box show={show} callback={setPopup} type={type} />
            ) : (
              <></>
            )
          )}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Display;
