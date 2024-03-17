import classNames from 'classnames/bind';
import style from './CardAlbumSong.module.scss';
import Tippy from '@tippyjs/react';
import moment from 'moment';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import path from '~/router/path';
import { memo } from 'react';
const cx = classNames.bind(style);
const CardAlbumSong = ({
  song,
  theme,
  onActiveSong,
  onPlaySong,
  currentSong,
  currentUser,
  onAddLikeSong,
  isPlay,
  onRemoveLikeSong,
  onNavigate,
  onNavigateArtist,
  index,
  status,
  chartIndex,
  hiddenSongTitle,
  hiddenIconMusic,
  releaseDate,
  // fileUpload,
}) => {
  const timeInSeconds = song.duration;
  const duration = moment.duration(timeInSeconds, 'seconds');
  const formattedTime = moment.utc(duration.asMilliseconds()).format('mm:ss');
  const isSelector = currentSong?.encodeId === song?.encodeId;
  const isLikeMusic = currentUser?.loveMusic.some(({ encodeId }) => encodeId === song?.encodeId);
  const currentTime = moment();
  const targetTime = moment.unix(song?.releaseDate);
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
  return (
    <div
      className={cx('media', {
        // fileUpload: fileUpload,
      })}
      onClick={onPlaySong}
      style={{ background: currentSong?.encodeId === song.encodeId && 'rgba(255, 255, 255, 0.1)' }}>
      <div className={cx('media-left')} style={{ gap: index && '15px', flex: hiddenSongTitle && '1' }}>
        {index && (
          <span
            className={cx('rank', {
              chartIndex: chartIndex,
              index: hiddenSongTitle,
              [index === 1 ? 'first' : index === 2 ? 'middle' : 'last']: index < 4,
            })}>
            {index}
          </span>
        )}
        {!hiddenIconMusic && <AudiotrackRoundedIcon />}
        {status ? (
          <div className={cx('status')}>
            {status < 0 ? (
              <div className={cx('status-song')}>
                <FaCaretDown fontSize={20} color={status < 0 && '#e35050'} />
                <span className={cx('number')}>{`${status}`.split('')[`${status}`.length - 1]}</span>
              </div>
            ) : status > 0 ? (
              <div className={cx('status-song')}>
                <FaCaretUp fontSize={20} color={status > 0 && '#1dc186'} />
                <span className={cx('number')}>{status}</span>
              </div>
            ) : null}
          </div>
        ) : (
          status === 0 && (
            <div className={cx('status-song')}>
              <span className={cx('line')}></span>
            </div>
          )
        )}
        <div className={cx('content')}>
          <div className={cx('avatar')}>
            <img src={song.thumbnailM} alt='error' />
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
          <div className={cx('relate')}>
            <h4>{song.title}</h4>
            <div className={cx('artists')}>
              {song.artists?.map(({ id, name, link }, index, arr) => (
                <span
                  key={id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link));
                  }}>
                  {name + `${index === arr.length - 1 ? '' : ', '}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!hiddenSongTitle && (
        <div className={cx('media-middle')}>
          <span onClick={onNavigate}>{song.album?.title}</span>
        </div>
      )}
      {releaseDate && (
        <div className={cx('media-middle')}>
          <span>{timeString}</span>
        </div>
      )}
      <div className={cx('media-right')}>
        <span className={cx('time')}>{formattedTime}</span>

        <div className={cx('action')}>
          <Tippy
            content={<span className='tippy-title'>Thêm vào thư viện</span>}
            followCursor='horizontal'
            // plugins={[followCursor]}
            placement='top'
            arrow={true}
            duration={300}>
            {isLikeMusic ? (
              <span className={cx('icon')} onClick={onRemoveLikeSong}>
                <FavoriteIcon fontSize='large' style={{ color: theme?.primaryColor }} />
              </span>
            ) : (
              <span className={cx('icon')} onClick={onAddLikeSong}>
                <FavoriteBorderIcon fontSize='large' />
              </span>
            )}
          </Tippy>
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

export default memo(CardAlbumSong);
