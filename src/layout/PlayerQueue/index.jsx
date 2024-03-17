import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import { v4 as uuid } from 'uuid';
import { AuthProvider } from '~/AuthProvider';
import { CardSong } from '~/components';
import classNames from 'classnames/bind';
import style from './PlayerQueue.module.scss';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(style);
const PlayerQueue = () => {
  const { isOpenPlayList, currentSong, isPlay, currentPlayList } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const [active, setActive] = useState(0);
  const { themeApp, handle, coords } = useContext(AuthProvider);
  const { onAddLikeSong, onRemoveLikeSong, onPlaySong, onActiveSong } = handle;
  const navigate = useNavigate();
  const thumbStyles = {
    width: '100%',
    backgroundColor: 'hsla(0,0%,100%,0.3)',
    position: 'relative',
    borderRadius: '5px',
  };
  // console.log(recentlySong);
  const handleMenuPlay = () => {
    if (active === 0) return;
    setActive(0);
  };
  const handleMenuHistory = () => {
    if (active === 1) return;
    setActive(1);
  };
  const handleNavigate = (url) => {
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  return (
    <div
      className={cx('player', {
        open: isOpenPlayList,
        hidden: !isOpenPlayList,
      })}
      style={{ background: '#2d2f32' }}>
      <Scrollbar
        onScroll={() => {
          if (coords?.isShowPortal) {
            onActiveSong(null, null);
          }
        }}
        trackYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
          },
        }}
        thumbYProps={{
          renderer: (props) => {
            const { elementRef, ...restProps } = props;
            return (
              <div
                {...restProps}
                ref={elementRef}
                className='tHuMbY'
                style={{
                  ...thumbStyles,
                }}
              />
            );
          },
        }}>
        <div className={cx('player-container')}>
          <div className={cx('header')}>
            <div className={cx('group-btn')}>
              <div
                onClick={handleMenuPlay}
                className={cx('btn-menu', {
                  active: active === 0,
                })}>
                Danh sách phát
              </div>
              <div
                onClick={handleMenuHistory}
                className={cx('btn-menu', {
                  active: active === 1,
                })}>
                Nghe ngần đây
              </div>
            </div>
          </div>
          {active === 0 && (
            <>
              <div className={cx('song-active')}>
                {!!currentSong && (
                  <CardSong
                    isHiddenTime={true}
                    onActiveSong={(e) => onActiveSong(e, currentSong)}
                    isPlay={isPlay}
                    currentSong={currentSong}
                    onAddLikeSong={onAddLikeSong}
                    onRemoveLikeSong={onRemoveLikeSong}
                    currentUser={currentUser}
                    card={currentSong}
                    isIconLove={true}
                    onNavigateArtist={handleNavigate}
                    className='edit'
                  />
                )}
              </div>
              <div className={cx('next-info__song')}>
                <h4>Tiếp theo</h4>
                {currentPlayList?.title && (
                  <p>
                    từ danh sách bài hát <span style={{ color: themeApp?.primaryColor }}> {currentPlayList?.title}</span>
                  </p>
                )}
              </div>
            </>
          )}
          <div className={cx('list-menu')}>
            {/* {currentPlayList?.title === 'Nhạc yêu thích' &&
              !!currentPlayList?.listItem.length &&
              currentPlayList?.listItem.map((card, _index, arr) => (
                <CardSong
                  key={uuid()}
                  onActiveSong={(e) => onActiveSong(e, card, true)}
                  isHiddenTime={true}
                  isPlay={isPlay}
                  currentSong={currentSong}
                  onAddLikeSong={(e) => onAddLikeSong(e, card)}
                  onRemoveLikeSong={(e) => onRemoveLikeSong(e, card.encodeId)}
                  currentUser={currentUser}
                  card={card}
                  isIconLove={true}
                  className='edit'
                  onPlaySong={() => onPlaySong(card, arr, currentPlayList?.title)}
                  onNavigateArtist={handleNavigate}
                />
              ))} */}
            {!!currentSong && active === 0
              ? (currentPlayList?.listItem || []).map((card, _index, arr) => (
                  <CardSong
                    key={uuid()}
                    onActiveSong={(e) => onActiveSong(e, card, true)}
                    isHiddenTime={true}
                    isPlay={isPlay}
                    currentSong={currentSong}
                    onAddLikeSong={(e) => onAddLikeSong(e, card)}
                    onRemoveLikeSong={(e) => onRemoveLikeSong(e, card.encodeId)}
                    currentUser={currentUser}
                    card={card}
                    isIconLove={true}
                    className='edit'
                    onPlaySong={() => onPlaySong(card, arr, currentSong?.currentTitle)}
                    onNavigateArtist={handleNavigate}
                  />
                ))
              : (currentUser?.historySong || []).map((card, _index, arr) => (
                  <CardSong
                    key={uuid()}
                    onActiveSong={(e) => onActiveSong(e, card, true, true)}
                    isHiddenTime={true}
                    isPlay={isPlay}
                    currentSong={currentSong}
                    onAddLikeSong={(e) => onAddLikeSong(e, card)}
                    onRemoveLikeSong={(e) => onRemoveLikeSong(e, card.encodeId)}
                    currentUser={currentUser}
                    card={card}
                    onNavigateArtist={handleNavigate}
                    isIconLove={true}
                    onPlaySong={() => {
                      onPlaySong(card, arr, 'Nghe gần đây');
                      setActive(0);
                    }}
                    className='edit'
                  />
                ))}
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};
// _differenceBy(currentPlayList?.listItem || [], (currentUser?.historySong.length && currentUser?.historySong) || [currentSong], 'encodeId');
export default PlayerQueue;
