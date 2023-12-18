import classNames from 'classnames/bind';
import style from './Button.module.scss';
const cx = classNames.bind(style);
const Button = ({ onClick, content, className, style, disabled, icon }) => {
  return (
    <button
      style={style}
      disabled={disabled}
      onClick={onClick}
      className={cx('btn', {
        [className]: className,
      })}>
      {icon}
      {content}
    </button>
  );
};

export default Button;
