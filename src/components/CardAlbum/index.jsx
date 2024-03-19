import classNames from 'classnames/bind';
import style from './CardAlbum.module.scss';
import Tippy from '@tippyjs/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { followCursor } from 'tippy.js';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { BsPlayCircle } from 'react-icons/bs';
import path from '~/router/path';
import { memo } from 'react';
const cx = classNames.bind(style);
const CardAlbum = ({
  data,
  onNavigatePlayList,
  noTitle,
  onAddPlayList,
  currentUser,
  onRemovePlayList,
  themeApp,
  onNavigateArtist,
  onDeletePlaylist,
  onPlayMusicInPlaylist,
  activeIdAlbum,
  isPlay,
}) => {
  const { thumbnailM, title, encodeId: idAlbum } = data;
  const isPlayList = currentUser?.followPlayList.some(({ encodeId }) => encodeId === idAlbum);
  const isAlbum = currentUser?.followAlbum.some(({ encodeId }) => encodeId === idAlbum);
  const isAlbumActive = idAlbum === activeIdAlbum || false;
  return (
    <div
      className={cx('card', {
        active: isAlbumActive && isPlay,
      })}>
      <div className={cx('avatar')} onClick={onNavigatePlayList}>
        <img loading='lazy' src={thumbnailM} alt='' />
        <div className={cx('menu-action')}>
          <div className={cx('action')}>
            {data?.isUser ? (
              <span className={cx('icon')} onClick={onDeletePlaylist}>
                <CloseRoundedIcon fontSize='large' />
              </span>
            ) : (
              <Tippy
                content={<span className='tippy-title'>Thêm vào thư viện</span>}
                followCursor='horizontal'
                // plugins={[followCursor]}
                placement='top'
                arrow={true}
                duration={300}>
                {isPlayList || isAlbum ? (
                  <span className={cx('icon')} onClick={onRemovePlayList}>
                    <FavoriteIcon fontSize='large' style={{ color: themeApp?.primaryColor }} />
                  </span>
                ) : (
                  <span className={cx('icon')} onClick={onAddPlayList}>
                    <FavoriteBorderIcon fontSize='large' />
                  </span>
                )}
              </Tippy>
            )}
            {isAlbumActive && isPlay ? (
              <div
                className={cx('icon', {
                  isPlay: isPlay,
                })}>
                <img src='https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif' alt='' />
              </div>
            ) : (
              <Tippy
                content={<span className='tippy-title'>{title}</span>}
                followCursor='horizontal'
                plugins={[followCursor]}
                placement='top'
                arrow={true}
                duration={300}>
                <span
                  className={cx('icon')}
                  onClick={(e) =>
                    onPlayMusicInPlaylist(e, {
                      id: idAlbum,
                      title: title,
                      thumbnailM: thumbnailM,
                      link: data?.link,
                      sortDescription: '',
                      artists: data?.artists,
                      isUser: data?.isUser,
                    })
                  }>
                  <BsPlayCircle className={cx('icon-play')} />
                </span>
              </Tippy>
            )}

            <Tippy
              content={<span className='tippy-title'>Khác</span>}
              followCursor='horizontal'
              // plugins={[followCursor]}
              placement='top'
              arrow={true}
              duration={300}>
              <span className={cx('icon')}>{<MoreHorizIcon fontSize='large' />}</span>
            </Tippy>
          </div>
        </div>
      </div>
      {noTitle && (
        <h3 className={cx('name')} onClick={onNavigatePlayList}>
          {title}
        </h3>
      )}
      <div className={cx('artists')} style={{ marginTop: !noTitle && '12px' }}>
        {data?.artists?.map(({ name, id, link }, index) => (
          <span key={id} onClick={() => onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link))}>
            {name + `${index === data.artists.length - 1 ? '' : ','}`}
          </span>
        )) ||
          (data?.artist && <span className={cx('default')}>{data?.artist}</span>) || <span className={cx('default')}>Zing MP3</span>}
      </div>
    </div>
  );
};

export default memo(CardAlbum);
