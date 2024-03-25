import { memo } from 'react';
import classNames from 'classnames/bind';
import style from './CardVideo.module.scss';
import moment from 'moment';
import { BsPlayCircle } from 'react-icons/bs';
import path from '~/router/path';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
const cx = classNames.bind(style);
const CardVideo = ({ data, onNavigate, onNavigateArtist, onOpenVideo, deleteHistory }) => {
  return (
    <div className={cx('card')} onClick={onOpenVideo}>
      <div className={cx('banner')}>
        <img loading='lazy' src={data?.thumbnailM} alt='' />
        <span className={cx('duration')}>{moment.unix(data?.duration).format('mm:ss')}</span>
        <div className={cx('icon-play')}>
          <BsPlayCircle />
        </div>
        {deleteHistory?.isIconDelete && (
          <div className={cx('icon-delete')} onClick={deleteHistory?.onDeleteHistory}>
            <CloseRoundedIcon />
          </div>
        )}
      </div>
      <div
        className={cx('user')}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}>
        <div className={cx('avatar')}>
          <img loading='lazy' src={data?.artist?.thumbnail} alt='' />
        </div>
        <div className={cx('content')}>
          <h3>{data?.title}</h3>
          <div className={cx('artists')}>
            {data?.artists?.map((item, index) => (
              <span
                key={item?.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', item?.link));
                }}>
                {item?.name}
                {item?.spotlight && <StarRoundedIcon fontSize='medium' />}
                {index === data?.artists.length - 1 ? '' : ','}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CardVideo);
