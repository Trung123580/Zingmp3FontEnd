import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Scrollbar } from 'react-scrollbars-custom';
import { v4 as uuid } from 'uuid';
import { AuthProvider } from '~/AuthProvider';
import { CardSong } from '~/components';
import classNames from 'classnames/bind';
import style from './PlayerQueue.module.scss';
import { differenceBy as _differenceBy } from 'lodash';
const cx = classNames.bind(style);
const PlayerQueue = () => {
  const { isOpenPlayList, currentSong, isPlay, currentPlayList } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const [active, setActive] = useState(0);
  const { themeApp, handle } = useContext(AuthProvider);
  const { onAddLikeSong, onRemoveLikeSong, onPlaySong } = handle;
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
  // console.log(currentUser);
  return (
    <div
      className={cx('player', {
        open: isOpenPlayList,
        hidden: !isOpenPlayList,
      })}
      style={{ background: '#2d2f32' }}>
      <Scrollbar
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
            <div className={cx('song-active')}>
              {!!currentSong && (
                <CardSong
                  isHiddenTime={true}
                  isPlay={isPlay}
                  currentSong={currentSong}
                  onAddLikeSong={onAddLikeSong}
                  onRemoveLikeSong={onRemoveLikeSong}
                  currentUser={currentUser}
                  card={currentSong}
                  isIconLove={true}
                  className='edit'
                />
              )}
            </div>
          )}
          {active === 0 && (
            <div className={cx('next-info__song')}>
              <h4>Tiếp theo</h4>
              <p>
                từ danh sách bài hát <span style={{ color: themeApp?.primaryColor }}> {currentPlayList?.title}</span>
              </p>
            </div>
          )}
          <div className={cx('list-menu')}>
            {!!currentSong && active === 0
              ? _differenceBy(
                  currentPlayList?.listItem,
                  (currentUser?.historySong.length && currentUser?.historySong) || [currentSong],
                  'encodeId'
                ).map((card, index, arr) => (
                  <CardSong
                    key={uuid()}
                    isHiddenTime={true}
                    isPlay={isPlay}
                    currentSong={currentSong}
                    onAddLikeSong={onAddLikeSong}
                    onRemoveLikeSong={onRemoveLikeSong}
                    currentUser={currentUser}
                    card={card}
                    isIconLove={true}
                    className='edit'
                    onPlaySong={() => onPlaySong(card, arr, currentSong?.currentTitle)}
                  />
                ))
              : currentUser?.historySong.map((card) => (
                  <CardSong
                    key={uuid()}
                    isHiddenTime={true}
                    isPlay={isPlay}
                    currentSong={currentSong}
                    onAddLikeSong={onAddLikeSong}
                    onRemoveLikeSong={onRemoveLikeSong}
                    currentUser={currentUser}
                    card={card}
                    isIconLove={true}
                    onPlaySong={() => {
                      onPlaySong(card, currentSong?.listItem, currentSong?.currentTitle);
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

export default PlayerQueue;
