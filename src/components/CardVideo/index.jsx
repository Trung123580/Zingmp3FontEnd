import classNames from 'classnames/bind';
import style from './CardVideo.module.scss';
import moment from 'moment';
import { BsPlayCircle } from 'react-icons/bs';
import path from '~/router/path';
const cx = classNames.bind(style);
const CardVideo = ({ data, onNavigate, onNavigateArtist, onOpenVideo }) => {
  return (
    <div className={cx('card')} onClick={onOpenVideo}>
      <div className={cx('banner')}>
        <img src={data?.thumbnailM} alt='' />
        <span className={cx('duration')}>{moment.unix(data?.duration).format('mm:ss')}</span>
        <div className={cx('icon-play')}>
          <BsPlayCircle />
        </div>
      </div>
      <div
        className={cx('user')}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}>
        <div className={cx('avatar')}>
          <img src={data?.artist?.thumbnail} alt='' />
        </div>
        <div className={cx('content')}>
          <h3>{data?.title}</h3>
          <div className={cx('artists')}>
            {data?.artists?.map(({ name, id, link }, index) => (
              <span
                key={id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link));
                }}>
                {name + `${index === data.artists.length - 1 ? '' : ','}`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardVideo;
