import classNames from 'classnames/bind';
import style from './MobileResponsiveHeader.module.scss';
import { TbWindowMinimize } from 'react-icons/tb';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PiMusicNotesSimpleBold, PiLink } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const MobileResponsiveHeader = ({
  onRemoveMv,
  onAddMv,
  themeApp,
  isExitsLikeVideo,
  videoId,
  dataVideo,
  onMiniPlayer,
  onAudioVideo,
  onCopyUrlClipBoard,
}) => {
  const navigate = useNavigate();
  return (
    <div className={cx('wrapper')}>
      <div className={cx('action-video')}>
        {isExitsLikeVideo ? (
          <div className={cx('item')} onClick={() => onRemoveMv(videoId)}>
            <FavoriteIcon fontSize='large' style={{ color: themeApp?.primaryColor }} />
            <span>Xóa khỏi thư viện</span>
          </div>
        ) : (
          <div className={cx('item')} onClick={() => onAddMv(dataVideo)}>
            <FavoriteBorderIcon fontSize='large' />
            <span>Thêm vào thư viện</span>
          </div>
        )}
        <div className={cx('item')} onClick={onAudioVideo}>
          <PiMusicNotesSimpleBold />
          <span>Nghe Audio</span>
        </div>
        <div className={cx('item')} onClick={onCopyUrlClipBoard}>
          <PiLink />
          <span>Sao chép link</span>
        </div>
        <div className={cx('item')} onClick={onMiniPlayer}>
          <TbWindowMinimize />
          <span>Thu nhỏ</span>
        </div>
        <div
          className={cx('item')}
          onClick={() => {
            const indexNavigate = JSON.parse(localStorage.getItem('backTo'));
            navigate(-indexNavigate);
          }}>
          <CloseRoundedIcon />
          <span>Đóng</span>
        </div>
      </div>
    </div>
  );
};

export default MobileResponsiveHeader;
