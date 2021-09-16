import React, { useEffect, useState } from "react";
import "./SearchModel.css";
import searchIcon from "../Icons/‏‏search_icon_gray.svg";
import axiosRequest from "../../axiosRequest";
import requestAPI from "../../requests";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import axios from "axios";
import {getColorRate} from "../../utilities";
import { translateNavbar } from "../../translate";

function SearchModel({ callback, isActive = false }) {
  const [movies, setMovie] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancel;
    if (isActive && search.length > 0) {
      axiosRequest
        .get(requestAPI.search + `&query=${search}&page=1`, {
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        })
        .then((response) => {
          if (response) {
            var movies = filterMovies(response.data.results);
            setMovie(movies);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return () => cancel();
    }
  }, [search]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function filterMovies(movies) {
    var filteredMovies = [];
    movies.map((data) => {
      if (data.media_type === "movie" || data.media_type === "tv")
        filteredMovies.push(data);
      return null;
    });
    return filteredMovies;
  }

  if (isActive) {
    return (
      <div className="overlay">
        <div className="model-search">
          <div className="model-search-header">
            <img className="searchIcon" src={searchIcon} alt="searchbar" />
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              className="searchInput"
              placeholder={translateNavbar().searchPlaceholder}
            />
            <button
              onClick={() => {
                callback.changeSearchStatus();
              }}
              className="closeButton"
            >
              &times;
            </button>
          </div>
          <div className="model-search-body">
            {movies.length ? (
              movies.map((movie) => (
                <Movie
                  show={movie}
                  callback={callback.popupCallback}
                  key={movie.id}
                  title={movie?.title || movie?.name || movie?.original_name|| movie?.original_title}
                  rate={movie.vote_average}
                  img={`${requestAPI.imgUrl}${movie.poster_path}`}
                />
              ))
            ) : (
              <p className="nothing"> {translateNavbar().searchResult} </p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}

function Movie(props) {
  return (
    <>
      <div
        onClick={() => {
          props.callback(props.show);
        }}
        className="movie"
      >
        <LazyLoadImage
          key={props.id}
          className="movieImgsm"
          alt={props.title}
          src={props.img}
          effect="blur"
        />
        <h3 className="title">{props.title}</h3>
        <p className={`rate ${getColorRate(props.rate)}`}>{props.rate}</p>
      </div>
      <hr />
    </>
  );
}
export default SearchModel;
