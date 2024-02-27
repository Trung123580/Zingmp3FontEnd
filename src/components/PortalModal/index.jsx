import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import style from './PortalModal.module.scss';
import { AuthProvider } from '~/AuthProvider';
import { LiaMicrophoneAltSolid } from 'react-icons/lia';
import { LuDownload } from 'react-icons/lu';
import DoDisturbRoundedIcon from '@mui/icons-material/DoDisturbRounded';
import { IoAddCircleOutline } from 'react-icons/io5';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
const cx = classNames.bind(style);
const PortalModal = () => {
  const { coords, handle } = useContext(AuthProvider);
  const { onOpenModal, onRemoveHistorySong } = handle;
  return (
    <div
      className={cx('portal')}
      style={{
        top: coords.y,
        left: coords.x - 280,
      }}>
      <div className={cx('portal__header')}>
        <div className={cx('portal__avatar')}>
          <img src={coords?.thumbnailM} alt='' />
        </div>
        <h3 className={cx('portal__name')}>{coords?.title}</h3>
      </div>
      <ul className={cx('portal__menu')}>
        <li className={cx('portal__item')} onClick={() => onOpenModal('Tính năng này chỉ được hỗ trợ download tại app Zing MP3', false)}>
          <LuDownload />
          <span>Tải xuống</span>
        </li>
        <li className={cx('portal__item')}>
          <LiaMicrophoneAltSolid />
          <span>Lời bài hát</span>
        </li>
        <li className={cx('portal__item')} onClick={() => onOpenModal('Tính năng chưa phát triển', false)}>
          <DoDisturbRoundedIcon />
          <span>Chặn</span>
        </li>
      </ul>
      <ul className={cx('portal__action')}>
        <li className={cx('portal__action-item')}>
          <span>
            <IoAddCircleOutline />
            Thêm vào play list
          </span>
          <span>
            <ArrowForwardIosIcon />
          </span>
        </li>
        {coords.isDelete && (
          // viet onclick delete
          <li className={cx('portal__action-item')} onClick={(e) => onRemoveHistorySong(e, coords.encodeId)}>
            <span>
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
