import classNames from 'classnames/bind';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import style from './CardNext.module.scss';
import path from '~/router/path';
const cx = classNames.bind(style);
const CardNext = (props) => {
  const { thumbnailM, title, artists, selectItem, theaterMode, onNavigate, onNavigateVideo, link, encodeId } = props;
  return (
    <div
      className={cx('item', {
        theaterMode: theaterMode,
        isActive: selectItem?.encodeId === encodeId,
      })}
      onClick={() => onNavigateVideo(link)}>
      <div className={cx('thumbnail')}>
        <img src={thumbnailM} alt='' />
      </div>
      <div className={cx('content')}>
        <h4 className={cx('name')}>{title}</h4>
        <ul className={cx('artists')}>
          {artists.map(({ id, name, spotlight, link: linkArtist }, index) => (
            <li key={id} className={cx('artists__item')} onClick={() => onNavigate(null, path.DETAILS_ARTIST.replace('/:name', linkArtist))}>
              {name}
              {spotlight && <StarRoundedIcon fontSize='medium' />}
              {index === artists.length - 1 ? '' : ','}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CardNext;
