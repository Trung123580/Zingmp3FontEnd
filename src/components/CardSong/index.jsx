import moment from 'moment';
import classNames from 'classnames/bind';
import style from './CardSong.module.scss';
import Tippy from '@tippyjs/react';
// import { followCursor } from 'tippy.js';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import path from '~/router/path';
const cx = classNames.bind(style);
const CardSong = ({
  style,
  card,
  //modal
  // active song
  onActiveSong,
  // show iconlove
  isIconLove,
  isPlay,
  currentSong,
  onPlaySong,
  currentUser,
  className,
  isHiddenTime,
  onAddLikeSong,
  onRemoveLikeSong,
  onNavigateArtist,
}) => {
  const currentTime = moment();
  const targetTime = moment.unix(card?.releaseDate);
  const timeDifference = currentTime.diff(targetTime, 'minutes');
  let timeString = '';
  if (timeDifference < 60) {
    timeString = `${timeDifference} phút trước`;
  } else if (timeDifference < 24 * 60) {
    const hours = Math.floor(timeDifference / 60);
    timeString = `${hours} giờ trước`;
  } else {
    const daysAgo = Math.floor(timeDifference / (24 * 60));
    timeString = `${daysAgo} ngày trước`;
  }
  const isSelector = currentSong?.encodeId === card?.encodeId;
  const isLikeMusic = currentUser?.loveMusic.some(({ encodeId }) => encodeId === card?.encodeId);
  return (
    <div
      className={cx('card', {
        [className]: className,
      })}
      onClick={onPlaySong}
      style={{ ...style, background: isSelector && 'rgba(255, 255, 255, 0.1)', padding: !!isHiddenTime && '8px' }}>
      <div className={cx('avatar')} style={{ minWidth: !!isHiddenTime && '40px', width: !!isIconLove && '40px' }}>
        <img src={card.thumbnailM} alt='Error' />
        {isPlay && isSelector ? (
          <div className={cx('play-song')}>
            <img src='https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif' alt='' />
          </div>
        ) : (
          <span
            className={cx('icon-play', {
              iconHover: !isSelector,
            })}>
            <PlayArrowRoundedIcon fontSize='large' />
          </span>
        )}
      </div>
      <div className={cx('wrapper')}>
        <div className={cx('content')}>
          <h3 className={cx('name')}>{card.title}</h3>
          <div className={cx('artists')}>
            {(card?.artists || []).map((item, index) => (
              <span
                key={item?.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', item?.link));
                }}>
                {item?.name + `${index === card?.artists?.length - 1 ? '' : ','}`}
              </span>
            ))}
          </div>
          {!isHiddenTime && <span className={cx('time-upload')}>{timeString}</span>}
        </div>
        <div className={cx('action')}>
          {isIconLove && (
            <Tippy
              content={<span className='tippy-title'>{isLikeMusic ? 'Xóa khỏi thư viện' : 'Thêm vào thư viện'} </span>}
              followCursor='horizontal'
              placement='top'
              arrow={true}
              duration={300}>
              {isLikeMusic ? (
                <span className={cx('icon')} style={{ padding: !!isIconLove && '5px' }} onClick={onRemoveLikeSong}>
                  <FavoriteIcon fontSize='large' />
                </span>
              ) : (
                <span className={cx('icon')} style={{ padding: !!isIconLove && '5px' }} onClick={onAddLikeSong}>
                  <FavoriteBorderIcon fontSize='large' />
                </span>
              )}
            </Tippy>
          )}
          <Tippy
            content={<span className='tippy-title'>Khác</span>}
            followCursor='horizontal'
            // plugins={[followCursor]}
            placement='top'
            arrow={true}
            duration={300}>
            <span className={cx('icon')} onClick={onActiveSong}>
              {<MoreHorizIcon fontSize='large' />}
            </span>
          </Tippy>
        </div>
      </div>
    </div>
  );
};

export default CardSong;
