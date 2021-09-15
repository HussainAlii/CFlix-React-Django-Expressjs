import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
  });

  export default instance;

export const django = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  // xsrfHeaderName: 'X-CSRFToken',
  // xsrfCookieName: 'csrftoken',
});

export const express = axios.create({
  baseURL: 'https://localhost:4000/',
});