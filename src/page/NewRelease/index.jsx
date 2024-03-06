import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import style from './NewRelease.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiHome } from '~/api';
import { isScrollTop } from '~/store/actions/dispatch';
import TitlePage from '~/utils/TitlePage';
import { AuthProvider } from '~/AuthProvider';
import { BoxSkeleton, CardFullSkeletonBanner } from '~/BaseSkeleton';
import { listBtnNewRelease } from '~/utils/constant';
import Button from '~/utils/Button';
import { CardAlbumSong } from '~/components';

const cx = classNames.bind(style);
const NewRelease = () => {
  const { themeApp, handle } = useContext(AuthProvider);
  const { newRelease, currentSong, isPlay } = useSelector((state) => state.app);
  const { currentUser } = useSelector((state) => state.auth);
  const { onPlaySong, onAddLikeSong, onRemoveLikeSong, onActiveSong } = handle;
  const navigate = useNavigate();
  const [stateNewRelease, setStateNewRelease] = useState({
    data: null,
    isLoading: false,
    activeBtn: 1,
    dataRender: [],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    if (newRelease) {
      setStateNewRelease((prev) => ({ ...prev, isLoading: true, data: newRelease }));
      return;
    }
    const getDataNewRelease = async () => {
      const response = await apiHome();
      if (response?.data?.err === 0) {
        const findData = response.data.data.items.find(({ sectionType }) => sectionType === 'new-release');
        setStateNewRelease((prev) => ({
          ...prev,
          isLoading: true,
          data: findData,
          dataRender: findData?.items['all'],
        }));
        dispatch(isScrollTop(true));
      }
    };
    getDataNewRelease();
    return () => {
      dispatch(isScrollTop(false));
    };
    // eslint-disable-next-line
  }, []);
  const handleTypeActive = (number, type) => {
    setStateNewRelease((prev) => ({ ...prev, activeBtn: number }));
    setStateNewRelease((prev) => ({ ...prev, dataRender: prev.data.items[type] }));
  };
  const handleNavigate = (url) => {
    // if (type === 1) return; // lam modal phat bai hat
    navigate(
      url
        .split('/')
        .filter((item) => item !== 'nghe-si')
        .join('/')
    );
  };
  if (!stateNewRelease.isLoading) {
    return (
      <div className={cx('container')}>
        <CardFullSkeletonBanner />
        <BoxSkeleton card={4} height={200} />
      </div>
    );
  }
  return (
    <section className={cx('container')}>
      <TitlePage
        content={newRelease?.title || stateNewRelease.data?.title}
        onClick={() => onPlaySong(stateNewRelease.dataRender[0], stateNewRelease.dataRender, newRelease?.title || stateNewRelease.data?.title)}
      />
      <div className={cx('release')}>
        <nav className={cx('header')} style={{ color: true && themeApp?.primaryColor }}>
          <div
            className={cx('text', {
              active: !stateNewRelease.isPageToggle,
            })}>
            Bài hát
          </div>
        </nav>
        <div className={cx('content')}>
          <div className={cx('wrapper__songs')}>
            <div className={cx('list-btn')}>
              {listBtnNewRelease.map(({ content, id, active, type }) => (
                <Button
                  key={id}
                  content={content}
                  className='genre-select'
                  style={{ background: stateNewRelease.activeBtn === active && themeApp?.primaryColor }}
                  onClick={() => handleTypeActive(active, type)}
                />
              ))}
            </div>
            <ul className={cx('select__header')}>
              <li className={cx('media-left')}>
                <span />
                bài hát
              </li>
              <li className={cx('media-middle')}>phát hành</li>
              <li className={cx('media-right')}>thời gian</li>
            </ul>
            {stateNewRelease.dataRender?.map((song, index, arr) => (
              <CardAlbumSong
                key={song?.encodeId}
                song={song}
                onActiveSong={(e) => onActiveSong(e, song)}
                currentSong={currentSong}
                currentUser={currentUser}
                onNavigateArtist={handleNavigate}
                onNavigate={() => handleNavigate(song.album.link.split('.')[0])}
                isPlay={isPlay}
                theme={themeApp}
                onAddLikeSong={(e) => onAddLikeSong(e, song)}
                onRemoveLikeSong={(e) => onRemoveLikeSong(e, song?.encodeId)}
                onPlaySong={() => onPlaySong(song, arr, '#zingchart')}
                // index={index + 1}
                status={song?.rakingStatus}
                hiddenSongTitle={true}
                // hiddenIconMusic={true}
                releaseDate={true}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewRelease;
