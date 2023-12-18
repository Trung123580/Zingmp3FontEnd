import classNames from 'classnames/bind';
import style from './Divide.module.scss';
const cx = classNames.bind(style);
const Divide = ({ fullWidth, style, className }) => {
  return (
    <div
      className={cx('sidebar-divide', {
        'full-width': fullWidth,
        [className]: className,
      })}
      style={style}></div>
  );
};

export default Divide;
