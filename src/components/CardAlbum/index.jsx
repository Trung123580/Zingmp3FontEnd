import classNames from 'classnames/bind';
import style from './CardAlbum.module.scss';
import Tippy from '@tippyjs/react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { followCursor } from 'tippy.js';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { BsPlayCircle } from 'react-icons/bs';
import path from '~/router/path';
const cx = classNames.bind(style);
const CardAlbum = ({ data, onNavigatePlayList, noTitle, onAddPlayList, currentUser, onRemovePlayList, themeApp, onNavigateArtist }) => {
  const { thumbnailM, title, encodeId: idAlbum } = data;
  const isPlayList = currentUser?.followPlayList.some(({ encodeId }) => encodeId === idAlbum);
  const isAlbum = currentUser?.followAlbum.some(({ encodeId }) => encodeId === idAlbum);
  return (
    <div className={cx('card')}>
      <div className={cx('avatar')} onClick={onNavigatePlayList}>
        <img src={thumbnailM} alt='' />
        <div className={cx('menu-action')}>
          <div className={cx('action')}>
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
            <Tippy
              content={<span className='tippy-title'>{title}</span>}
              followCursor='horizontal'
              plugins={[followCursor]}
              placement='top'
              arrow={true}
              duration={300}>
              <span className={cx('icon')}>
                <BsPlayCircle className={cx('icon-play')} />
              </span>
            </Tippy>
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
        ))}
      </div>
    </div>
  );
};

export default CardAlbum;
