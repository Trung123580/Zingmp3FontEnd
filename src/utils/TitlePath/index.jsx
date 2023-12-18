import classNames from 'classnames/bind';
import style from './TitlePath.module.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
const cx = classNames.bind(style);
const TitlePath = ({ content, show, onClick, style }) => {
  return (
    <div className={cx('title')} style={style}>
      <h3 className={cx('name')}>{content}</h3>
      {show && (
        <div className={cx('show')} onClick={onClick}>
          <span>tất cả</span>
          <ArrowForwardIosIcon />
        </div>
      )}
    </div>
  );
};

export default TitlePath;
