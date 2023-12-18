import classNames from 'classnames/bind';
import style from './SingerListSong.module.scss';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
const cx = classNames.bind(style);
const SingerListSong = ({ playListData }) => {
  return (
    <div className={cx('list-song')}>
      <h5>
        Lời tựa <span>{playListData.description}</span>
      </h5>
      <div className={cx('menu')}>
        <div className={cx('media-left')}>
          <SortByAlphaIcon />
          Bài hát
        </div>
        <div className={cx('media-middle')}>ALBUM</div>
        <div className={cx('media-right')}>THỜI GIAN</div>
      </div>
    </div>
  );
};
export default SingerListSong;
