import moment from 'moment';
import classNames from 'classnames/bind';
import style from './CardRank.module.scss';
import path from '~/router/path';
const cx = classNames.bind(style);

const CardRank = ({ data, index, onPlaySong, onNavigateArtist }) => {
  const { thumbnailM, title, artists, releaseDate } = data;
  return (
    <div className={cx('media')} onClick={onPlaySong}>
      <div className={cx('avatar')}>
        <img src={thumbnailM} alt='' />
      </div>
      <div className={cx('content')}>
        <div className={cx('name')}>
          <h3>{title}</h3>
          <div className={cx('artists')}>
            {artists?.map(({ name, id, link }, index) => (
              <span
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link));
                }}>
                {name + `${index === artists.length - 1 ? '' : ', '}`}
              </span>
            ))}
          </div>
        </div>
        <div className={cx('order')}>
          <span className={cx('first')}>#{index + 1}</span>
          <span className={cx('last')}>{moment.unix(releaseDate).format('DD.MM.YYYY')}</span>
        </div>
      </div>
    </div>
  );
};

export default CardRank;
