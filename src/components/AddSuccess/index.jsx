// import { useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './AddSuccess.module.scss';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { AuthProvider } from '~/AuthProvider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
const cx = classNames.bind(style);
const AddSuccess = () => {
  const { showSuccess } = useSelector((state) => state.app);
  const { themeApp } = useContext(AuthProvider);
  if (!showSuccess?.type) return;
  return (
    <div className={cx('success')} style={{ background: themeApp?.primaryColor }}>
      {showSuccess?.content}
      <CloseRoundedIcon />
    </div>
  );
};

export default AddSuccess;
