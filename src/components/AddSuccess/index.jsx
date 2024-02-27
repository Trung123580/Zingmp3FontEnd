// import { useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './AddSuccess.module.scss';
import { useSelector } from 'react-redux';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthProvider } from '~/AuthProvider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { addSuccess } from '~/store/actions/dispatch';
const cx = classNames.bind(style);
const AddSuccess = () => {
  const { showSuccess } = useSelector((state) => state.app);
  const { themeApp } = useContext(AuthProvider);
  const dispatch = useDispatch();
  useEffect(() => {
    let timesShowSuccess;
    if (!showSuccess.type) return;
    timesShowSuccess = setTimeout(() => {
      dispatch(addSuccess({ type: false, content: '' }));
    }, 2000);
    return () => {
      timesShowSuccess && clearTimeout(timesShowSuccess);
    };
    // eslint-disable-next-line
  }, [showSuccess?.type]);
  if (!showSuccess?.type) return;
  return (
    <div className={cx('success')} style={{ background: themeApp?.primaryColor }}>
      {showSuccess?.content}
      <CloseRoundedIcon />
    </div>
  );
};

export default AddSuccess;
