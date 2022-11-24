import { createReducer } from '@reduxjs/toolkit';

import {
  setActiveGenre,
  getFiltredByGenreFilmList,
  resetFilmsCount,
  increaseFilmsCount,
  loadFilms,
  requireAuthorization,
  loadPromoFilm,
} from './action';

import { Genre, FILMS_COUNT, AuthorizationStatus } from '../const';

import { Films } from '../types/films';
import { Film } from '../types/film';

type InitialState = {
  activeGenre: typeof Genre[keyof typeof Genre];
  films: Films;
  promoFilm: Film | null;
  filtredByGenreFilmList: Films;
  filmsCount: number;
  authorizationStatus: typeof AuthorizationStatus[keyof typeof AuthorizationStatus];
  isLoading: boolean;
};

const initialState: InitialState = {
  activeGenre: Genre.AllGenres,
  films: [],
  promoFilm: null,
  filtredByGenreFilmList: [],
  filmsCount: FILMS_COUNT,
  authorizationStatus: AuthorizationStatus.Unknown,
  isLoading: true,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setActiveGenre, (state, action) => {
      state.activeGenre = action.payload;
    })
    .addCase(getFiltredByGenreFilmList, (state) => {
      if (state.activeGenre === Genre.AllGenres) {
        state.filtredByGenreFilmList = state.films;
      } else {
        state.filtredByGenreFilmList = state.films.filter(
          (film) => film.genre === state.activeGenre,
        );
      }
    })
    .addCase(resetFilmsCount, (state) => {
      state.filmsCount = FILMS_COUNT;
    })
    .addCase(increaseFilmsCount, (state) => {
      state.filmsCount += FILMS_COUNT;
    })
    .addCase(loadFilms, (state, action) => {
      state.films = action.payload;
      state.filtredByGenreFilmList = action.payload;
      state.isLoading = false;
    })
    .addCase(loadPromoFilm, (state, action) => {
      state.promoFilm = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    });
});

export { reducer };
