import { Helmet } from 'react-helmet-async';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Logo from '../../components/logo/logo';
import Footer from '../../components/footer/footer';
import FilmsList from '../../components/films-list/films-list';
import GenresList from '../../components/genres-list/genres-list';
import ShowMoreButton from '../../components/show-more-button/show-more-button';
import UserBlock from '../../components/user-block/user-block';
import NotFoundScreen from '../not-found-screen/not-found-screen';

import {
  changeFilmStatusAction,
  fetchPromoFilmAction,
  fetchFavoriteFilmsAction,
} from '../../store/api-actions';

import { getFavoriteStatusChange, getPromoFilm } from '../../store/site-process/selectors';

import { useAppSelector } from '../../hooks/useAppSelector';

import { Films } from '../../types/films';

import {
  getFiltredByGenreFilms,
  getFilmsCount,
  getFavoriteFilms,
} from '../../store/site-process/selectors';
import { getAuthorizationStatus } from '../../store/user-process/selectors';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { redirectToRoute } from '../../store/action';

type Props = {
  films: Films;
};

const MainScreen = ({ films }: Props): JSX.Element => {
  const favoriteFilms = useAppSelector(getFavoriteFilms);
  const filtredByGenreFilmList = useAppSelector(getFiltredByGenreFilms);
  const filmsCount = useAppSelector(getFilmsCount);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const favoriteStatusChange = useAppSelector(getFavoriteStatusChange);
  const promoFilm = useAppSelector(getPromoFilm);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchFavoriteFilmsAction());

    if (favoriteStatusChange) {
      dispatch(fetchPromoFilmAction());
    }
  }, [favoriteStatusChange, dispatch]);

  const handlePlayBtnClick = () => {
    if (!promoFilm) {
      return;
    }

    const path = `/player/${promoFilm.id}`;

    navigate(path);
  };

  if (!promoFilm) {
    return <NotFoundScreen />;
  }

  const handleAddFilmBtnClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.SignIn));
    }
    dispatch(
      changeFilmStatusAction({ filmId: promoFilm.id, status: Number(!promoFilm.isFavorite) }),
    );
  };

  return (
    <>
      <Helmet>
        <title>Что посмотреть.</title>
      </Helmet>
      <section className="film-card">
        <div className="film-card__bg">
          <img src={promoFilm?.backgroundImage} alt={promoFilm?.name} />
        </div>

        <h1 className="visually-hidden">WTW</h1>

        <header className="page-header film-card__head">
          <Logo isLogoLight={false} />

          <UserBlock />
        </header>

        <div className="film-card__wrap">
          <div className="film-card__info">
            <div className="film-card__poster">
              <img src={promoFilm?.posterImage} alt={promoFilm?.name} width="218" height="327" />
            </div>

            <div className="film-card__desc">
              <h2 className="film-card__title">{promoFilm?.name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{promoFilm?.genre}</span>
                <span className="film-card__year">{promoFilm?.released}</span>
              </p>

              <div className="film-card__buttons">
                <button
                  className="btn btn--play film-card__button"
                  type="button"
                  onClick={handlePlayBtnClick}
                >
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s"></use>
                  </svg>
                  <span>Play</span>
                </button>
                <button
                  className="btn btn--list film-card__button"
                  type="button"
                  onClick={handleAddFilmBtnClick}
                >
                  {!promoFilm.isFavorite ? (
                    <svg viewBox="0 0 19 20" width="19" height="20">
                      <use xlinkHref="#add"></use>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 18 14" width="18" height="14">
                      <use xlinkHref="#in-list"></use>
                    </svg>
                  )}
                  <span>My list</span>
                  <span className="film-card__count">{favoriteFilms.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-content">
        <section className="catalog">
          <h2 className="catalog__title visually-hidden">Catalog</h2>

          <GenresList films={films} />

          <FilmsList films={filtredByGenreFilmList.slice(0, filmsCount)} />

          {filtredByGenreFilmList.length - filmsCount > 0 && <ShowMoreButton />}
        </section>

        <Footer />
      </div>
    </>
  );
};

export default MainScreen;
