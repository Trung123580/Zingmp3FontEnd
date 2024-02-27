import Button from '~/utils/Button';
import classNames from 'classnames/bind';
import style from './CardArtists.module.scss';
import { BsPersonAdd, BsCheck2 } from 'react-icons/bs';
const cx = classNames.bind(style);
const CardArtists = ({ data, themeApp, onNavigate, isFollowArtist, onToggleArtist }) => {
  return (
    <div className={cx('card-artist')}>
      <div className={cx('avatar')} onClick={onNavigate}>
        <img src={data?.thumbnailM} alt='' />
      </div>
      <div className={cx('content')}>
        <h3>{data?.name}</h3>
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
        {/* sử dụng thẻ link */}
        {/* onclick={data?.link} */}
      </div>
      <div className={cx('btn-s')}>
        <Button
          content={isFollowArtist ? 'Đã quan tâm' : 'quan tâm'}
          className='add-artist'
          onClick={onToggleArtist}
          icon={isFollowArtist ? <BsCheck2 fontSize='16px' /> : <BsPersonAdd fontSize='16px' />}
          style={{ borderColor: themeApp?.primaryColor, background: themeApp?.primaryColor }}
        />
        {/*  <Button
                  content={isFollowArtist ? 'Đã quan tâm' : 'quan tâm'}
                  onClick={(e) => (isFollowArtist ? onRemoveArtist(e, artistInfo.id) : onAddArtist(e, artistInfo))}
                  icon={isFollowArtist ? <BsCheck2 fontSize='16px' /> : <BsPersonAdd fontSize='16px' />}
                  className='add-artist'
                  style={{ borderColor: themeApp?.primaryColor }}
                /> */}
      </div>
    </div>
  );
};

export default CardArtists;
