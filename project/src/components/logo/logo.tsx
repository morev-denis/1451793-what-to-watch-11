import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

type LogoProps = {
  isLogoLight: boolean;
};

function Logo({ isLogoLight }: LogoProps): JSX.Element {
  return (
    <div className="logo">
      <Link
        className={isLogoLight ? 'logo__link logo__link--light' : 'logo__link'}
        to={AppRoute.Root}
      >
        <span className="logo__letter logo__letter--1">W</span>
        <span className="logo__letter logo__letter--2">T</span>
        <span className="logo__letter logo__letter--3">W</span>
      </Link>
    </div>
  );
}

export default Logo;
