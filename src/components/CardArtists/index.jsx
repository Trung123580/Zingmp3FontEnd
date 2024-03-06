import Button from '~/utils/Button';
import classNames from 'classnames/bind';
import style from './CardArtists.module.scss';
import { BsPersonAdd, BsCheck2 } from 'react-icons/bs';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
const cx = classNames.bind(style);
const CardArtists = ({ data, themeApp, onNavigate, isFollowArtist, onToggleArtist, isHiddenFollow, navigateFollow }) => {
  if (navigateFollow) {
    return (
      <div className={cx('card-artist')} style={{ color: themeApp?.primaryColor }} onClick={onNavigate}>
        <div
          className={cx('avatar', {
            navigateFollow: navigateFollow,
          })}>
          <ArrowForwardRoundedIcon fontSize='large' className={cx('icon__arrow')} />
        </div>
        <div
          className={cx('content', {
            navigateFollow: navigateFollow,
          })}>
          <h3>Xem tất cả</h3>
        </div>
      </div>
    );
  }
  return (
    <div className={cx('card-artist')} style={{ color: themeApp?.primaryColor }}>
      <div className={cx('avatar')} onClick={onNavigate}>
        <img src={data?.thumbnailM} alt='' />
      </div>
      <div className={cx('content')}>
        <h3>{data?.name}</h3>
        {!isHiddenFollow && (
          <span>
            {data?.totalFollow !== undefined && (
              <>
                {data?.totalFollow >= 100000000
                  ? `${Math.round(data?.totalFollow / 100000000)}M`
                  : data?.totalFollow >= 1000000
                  ? `${Math.round(data?.totalFollow / 1000000)}M`
                  : data?.totalFollow >= 1000
                  ? `${Math.round(data?.totalFollow / 1000)}K`
                  : data?.totalFollow}{' '}
              </>
            )}
            quan tâm
          </span>
        )}
        {/* sử dụng thẻ link */}
        {/* onclick={data?.link} */}
      </div>
      {!isHiddenFollow && (
        <div className={cx('btn-s')}>
          <Button
            content={isFollowArtist ? 'Đã quan tâm' : 'quan tâm'}
            className='add-artist'
            onClick={onToggleArtist}
            icon={isFollowArtist ? <BsCheck2 fontSize='16px' /> : <BsPersonAdd fontSize='16px' />}
            style={{ borderColor: themeApp?.primaryColor, background: themeApp?.primaryColor }}
          />
        </div>
      )}
    </div>
  );
};

export default CardArtists;
