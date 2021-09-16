import React, { useState, useEffect } from "react";
import "./Row.css";
import axiosRequest,{django} from "../../axiosRequest";
import ScrollContainer from "react-indiana-drag-scroll";
import Box from "../Box/Box";
import { Link } from "react-router-dom";
import axios from "axios";
import { getShowById } from "../../requests";
function Row({big = false, title = "", data, callback, from_django=false}) {
  const [boxes, setBoxes] = useState([])

  useEffect(() => {
    let cancelTok

    if(from_django){

      django
      .get(data.fetchUrl,{cancelToken:new axios.CancelToken(c => cancelTok = c)})
      .then(async (response) => {
        for(let i=0;i<response.data.length;i++){
          let django_data = response.data[i]
      axiosRequest
      .get(getShowById(django_data.vid, django_data.type),{cancelToken:new axios.CancelToken(c => cancelTok = c)})
      .then(async (res) => {
          if(res.data){
            setBoxes( [...boxes, boxes[i]=<Box
                show={res.data}
                callback={callback}
                big={big}
                key={django_data.vid}
                from_django = {django_data}
              />]
              )
            }
      })
      .catch((error) => {
        console.log(error);
      });

        }
      })
      .catch((error) => {
        console.log(error);
      });

    }else{
      axiosRequest
      .get(data.fetchUrl,{cancelToken:new axios.CancelToken(c => cancelTok = c)})
      .then(async (response) => {
        for(let i=0;i<response.data.results.length;i++){
          if(response.data.results[i].backdrop_path&&response.data.results[i].original_language==="en" &&response.data.results[i].poster_path&& response.data.results[i].media_type !="person"){
            setBoxes( [...boxes, boxes[i]=<Box
                show={response.data.results[i]}
                callback={callback}
                big={big}
                key={response.data.results[i].id}
                type={data.media_type}
              />]
              )
            }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
      return () => cancelTok()
  }, []);

  return (
    <div key={data.key} className="row">
      
      <Link style={{display: "inline-block"}} to={`/Display/${data.url}`}>
        <h2
          style={{ color: "white"}}
          className={`${big ? "bigText" : ""} title`}
        >
          {`${title}>>`}
        </h2>
      </Link>
      <ScrollContainer className="scroll-container posters">
           {boxes}
      </ScrollContainer>
    </div>
  );
}
//

export default Row;
