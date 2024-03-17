import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import style from './PortalModal.module.scss';
import { AuthProvider } from '~/AuthProvider';
import { LiaMicrophoneAltSolid } from 'react-icons/lia';
import { LuDownload } from 'react-icons/lu';
import DoDisturbRoundedIcon from '@mui/icons-material/DoDisturbRounded';
import { IoAddCircleOutline } from 'react-icons/io5';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Scrollbar } from 'react-scrollbars-custom';
const cx = classNames.bind(style);
const PortalModal = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { coords, handle } = useContext(AuthProvider);
  const { onOpenModal, onRemoveHistorySong, onAddSongPlaylist } = handle;
  const [dataPlaylist, setDataPlaylist] = useState(currentUser?.createPlaylist || []);
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (search) {
      const filterPlaylist = currentUser?.createPlaylist?.filter((item) => {
        const value = item.title.toLowerCase().trim();
        return value.includes(search.toLowerCase().trim());
      });
      setDataPlaylist(filterPlaylist);
    } else {
      setDataPlaylist(currentUser?.createPlaylist || []);
    }
  }, [search, currentUser]);

  return (
    <div
      className={cx('portal')}
      style={{
        top: coords.y,
        left: coords.x - 280,
      }}>
      <div className={cx('portal__header')}>
        <div className={cx('portal__avatar')}>
          <img src={coords.song?.thumbnailM} alt='' />
        </div>
        <h3 className={cx('portal__name')}>{coords.song?.title}</h3>
      </div>
      <ul className={cx('portal__menu')}>
        <li
          className={cx('portal__item')}
          onClick={() => onOpenModal({ name: 'Tính năng này chỉ được hỗ trợ download tại app Zing MP3', type: false })}>
          <LuDownload />
          <span>Tải xuống</span>
        </li>
        <li
          className={cx('portal__item')}
          onClick={() => onOpenModal({ type: false, desc: null, id: coords?.song?.encodeId, isModalShowLyric: true })}>
          <LiaMicrophoneAltSolid />
          <span>Lời bài hát</span>
        </li>
        <li className={cx('portal__item')} onClick={() => onOpenModal({ name: 'Tính năng chưa phát triển', type: false })}>
          <DoDisturbRoundedIcon />
          <span>Chặn</span>
        </li>
      </ul>
      <ul className={cx('portal__action')}>
        <li className={cx('portal__action-item')}>
          <span className={cx('content__text')}>
            <IoAddCircleOutline />
            Thêm vào play list
          </span>
          <span>
            <ArrowForwardIosIcon />
          </span>
          <div className={cx('playlist')}>
            <div className={cx('search')}>
              <input
                type='text'
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Tìm playlist'
                autoComplete='off'
                autoFocus={true}
                id={cx('search__playlist')}
              />
            </div>
            <ul className={cx('list')}>
              <li
                className={cx('item')}
                onClick={() =>
                  onOpenModal(
                    {
                      name: 'Tạo playlist mới',
                      type: true,
                    },
                    true
                  )
                }>
                <i className={cx('icon')} />
                <span>Tạo playlist mới</span>
              </li>
              <Scrollbar
                wrapperProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return <span {...restProps} ref={elementRef} style={{ inset: '0 0 10px 0' }} />;
                  },
                }}
                trackYProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return <div {...restProps} ref={elementRef} className='trackY' style={{ ...restProps.style, width: '4px' }} />;
                  },
                }}
                trackXProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return <span {...restProps} ref={elementRef} className='TrackX' style={{ ...restProps.style, display: 'none' }} />;
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
                          width: '100%',
                          backgroundColor: 'hsla(0,0%,100%,0.3)',
                          zIndex: '50',
                          position: 'relative',
                          borderRadius: '5px',
                        }}
                      />
                    );
                  },
                }}>
                {dataPlaylist.map((playlist) => (
                  <li className={cx('item')} key={playlist.encodeId} onClick={() => onAddSongPlaylist(playlist.encodeId, coords.song)}>
                    <QueueMusicRoundedIcon fontSize='large' /> {playlist.title}
                  </li>
                ))}
              </Scrollbar>
            </ul>
          </div>
        </li>
        {coords.isDelete && (
          // viet onclick delete
          <li className={cx('portal__action-item')} onClick={(e) => onRemoveHistorySong(e, coords.encodeId)}>
            <span className={cx('content__text')}>
              <DeleteOutlineRoundedIcon />
              Xóa
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default PortalModal;
