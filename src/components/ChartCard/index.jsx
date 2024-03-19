import classNames from 'classnames/bind';
import style from './ChartCard.module.scss';
import path from '~/router/path';
const cx = classNames.bind(style);
const ChartCard = ({ data, index, totalScore, active, style, onPlaySong, onNavigateArtist }) => {
  const { thumbnailM, title, artists, score } = data;
  return (
    <div
      className={cx('card', {
        active: active,
      })}
      style={style}
      onClick={onPlaySong}>
      {!!index && <span className={cx('rank')}>{index}</span>}
      <div className={cx('main')}>
        <div className={cx('avatar')} style={{ margin: !index && '0 10px 0 0', minWidth: !index && '40px', width: !index && '40px' }}>
          <img loading='lazy' src={thumbnailM} alt='error' />
        </div>
        <div className={cx('text')}>
          <h3 style={{ fontSize: !index && '1.2rem' }}>{title}</h3>
          <div className={cx('artists')} style={{ color: !index && 'rgba(255, 255, 255 , .8)' }}>
            {artists.map(({ name, id, link }, index) => (
              <span
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link));
                }}>
                {name + `${index === artists.length - 1 ? '' : ','}`}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span className={cx('percent')} style={{ fontSize: !index && '1.3rem' }}>
        {Math.round((Number(score) * 100) / Number(totalScore))}%
      </span>
    </div>
  );
};

export default ChartCard;
