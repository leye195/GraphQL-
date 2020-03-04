/*export const people = [
  {
    id: 1,
    name: "DanYJ",
    age: 20,
    gender: "male"
  },
  {
    id: 2,
    name: "Dan",
    age: 10,
    gender: "male"
  },
  {
    id: 3,
    name: "YJ",
    age: 23,
    gender: "male"
  },
  {
    id: 4,
    name: "DYJ",
    age: 15,
    gender: "female"
  },
  {
    id: 5,
    name: "anJ",
    age: 28,
    gender: "female"
  }
];*/
/*
let movies = [
  {
    id: 0,
    name: "Star Wars - The new one",
    score: 0.1
  },
  {
    id: 1,
    name: "Avengers -The new one",
    score: 0.5
  },
  {
    id: 2,
    name: "Star Wars - The one",
    score: 0.1
  },
  {
    id: 3,
    name: "Aven -The new one",
    score: 0.5
  }
];
export const getMovies = () => movies;
export const getById = id => {
  const filteredMovies = movies.filter(item => item.id === id);
  return filteredMovies[0];
};
export const deleteMovie = id => {
  const cleanedMovies = movies.filter(item => item.id !== id);
  if (movies.length > cleanedMovies.length) {
    movies = cleanedMovies;
    return true;
  } else {
    return false;
  }
};
export const addMovie = (name, score) => {
  const newMovie = {
    id: movies.length + 1,
    name,
    score
  };
  movies.push(newMovie);
  return newMovie;
};*/
import axios from "axios";
const URL = "https://yts.mx/api/v2";
export const getMovies = async (limit, rating) => {
  let requestURL = `${URL}/list_movies.json?`;
  if (limit > 0) {
    requestURL += `limit=${limit}&`;
  }
  if (rating > 0) {
    requestURL += `minimum_rating=${rating}`;
  }
  const {
    data: {
      data: { movies }
    }
  } = await axios.get(requestURL);
  return movies;
  /*return fetch(`${requestURL}`)
    .then(res => res.json())
    .then(json => json.data.movies);*/
};
export const getById = async id => {
  const {
    data: {
      data: { movie }
    }
  } = await axios.get(`${URL}/movie_details.json?movie_id=${id}`);
  return movie;
};

export const getRecommendations = async id => {
  const requestURL = `${URL}/movie_suggestions.json?movie_id=${id}`;
  const {
    data: {
      data: { movies }
    }
  } = await axios.get(requestURL);
  return movies;
};
