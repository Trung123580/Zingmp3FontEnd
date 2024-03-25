import { Scrollbar } from 'react-scrollbars-custom';
import Button from '~/utils/Button';
import Divide from '~/utils/Divide';
import BlockIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import classNames from 'classnames/bind';
import style from './UserProfile.module.scss';
import { memo } from 'react';
const cx = classNames.bind(style);
const UserProfile = ({ user, onSignOutApp }) => {
  return (
    <div className={cx('login')}>
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
                  width: '100%',
                  backgroundColor: 'hsla(0,0%,100%,0.3)',
                  zIndex: '999',
                  position: 'relative',
                  borderRadius: '5px',
                }}
              />
            );
          },
        }}>
        <div className={cx('info')}>
          <div className={cx('img')}>
            <img src={user?.photoURL} alt='' />
          </div>
          <h4 className={cx('name')}>{user?.displayName}</h4>
        </div>
        <div className={cx('level')}>
          <Button content='Nâng cấp tài khoản' className='login' style={{ width: '100%', padding: '6px 0', border: 'none' }} />
        </div>
        <Divide fullWidth={true} style={{ margin: '10px 0 5px ' }} className='p-10' />
        <h3 className={cx('individual')}>Cá nhân</h3>
        <div className={cx('menu-action')}>
          <div className={cx('action-item')}>
            <Button content='Danh sách chặn' icon={<BlockIcon fontSize='large' />} />
          </div>
          <div className={cx('action-item')}>
            <Button content='Tải lên' icon={<LogoutIcon sx={{ transform: 'rotate(270deg)' }} fontSize='large' />} />
          </div>
          <Divide fullWidth={true} style={{ margin: '10px 0 5px ' }} />
          <div className={cx('action-item')}>
            <Button content='Đăng xuất' onClick={onSignOutApp} icon={<LogoutIcon fontSize='large' />} />
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

export default memo(UserProfile);
