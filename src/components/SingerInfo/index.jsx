import moment from 'moment';
import classNames from 'classnames/bind';
import style from './UserInfo.module.scss';
import Tippy from '@tippyjs/react';
import Button from '~/utils/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import path from '~/router/path';
const cx = classNames.bind(style);
const UserInfo = ({ playListData, theme, onAddPlayList, onRemovePlayList, currentUser, onNavigateArtist, onEditNamePlaylist, onPlaySong }) => {
  const { encodeId: idAlbum } = playListData;
  const isAlbum = currentUser?.followPlayList.some(({ encodeId }) => encodeId === idAlbum);
  return (
    <div className={cx('album')}>
      <div className={cx('info-artists')}>
        <figure className={cx('avatar')}>
          <img src={playListData?.thumbnailM} alt='error' />
        </figure>
        <h3>
          {playListData?.title}
          {playListData?.isPlaylistUser && <MdOutlineModeEditOutline onClick={onEditNamePlaylist} className={cx('icon__delete')} />}
        </h3>
        {playListData?.isPlaylistUser ? (
          <p className={cx('text')}>
            Tạo bởi <span style={{ color: '#fff' }}>{currentUser?.userName}</span>
          </p>
        ) : (
          <span className={cx('text')}>Cập nhật: {moment.unix(playListData?.contentLastUpdate).format('DD/MM/YYYY')}</span>
        )}
        <div className={cx('artists')}>
          {playListData?.isPlaylistUser && <span className={cx('title__artist')}>Ca sĩ theo dõi:</span>}
          {playListData?.artists?.map(({ name, id, link }, index) => (
            <span key={id} onClick={() => onNavigateArtist(path.DETAILS_ARTIST.replace('/:name', link))}>
              {name + `${index === playListData.artists.length - 1 ? '' : ','}`}
            </span>
          ))}
        </div>
        {!playListData?.isPlaylistUser && (
          <span className={cx('text')}>
            {playListData?.like >= 1000 ? `${Math.round(playListData.like / 1000)}K` : playListData.like} người theo dõi
          </span>
        )}
        <div className={cx('level')}>
          <Button
            content='PHÁT TẤT CẢ'
            style={{ background: theme?.primaryColor }}
            className='btn-allPlaylist'
            onClick={onPlaySong}
            icon={<PlayArrowRoundedIcon fontSize='large' sx={{ height: '20px' }} />}
          />
          <div className={cx('action')}>
            {!playListData?.isPlaylistUser && (
              <>
                <Tippy
                  content={<span className='tippy-title'>Thêm vào thư viện</span>}
                  followCursor='horizontal'
                  placement='top'
                  arrow={true}
                  duration={300}>
                  {isAlbum ? (
                    <span className={cx('icon')} onClick={onRemovePlayList}>
                      <FavoriteIcon fontSize='large' style={{ color: theme?.primaryColor }} />
                    </span>
                  ) : (
                    <span className={cx('icon')} onClick={onAddPlayList}>
                      <FavoriteBorderIcon fontSize='large' />
                    </span>
                  )}
                </Tippy>
                <Tippy content={<span className='tippy-title'>Khác</span>} followCursor='horizontal' placement='top' arrow={true} duration={300}>
                  <span className={cx('icon')}>{<MoreHorizIcon fontSize='large' />}</span>
                </Tippy>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
