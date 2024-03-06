import classNames from 'classnames/bind';
import style from './TitlePage.module.scss';
import Button from '~/utils/Button';
import { IconTitlePage } from '~/asset/logo';
const cx = classNames.bind(style);
const TitlePage = ({ content, className, onClick, style }) => {
  return (
    <div className={cx('wrapper')} style={style}>
      <h3
        className={cx('name', {
          [className]: className,
        })}>
        {content}
      </h3>
      <Button onClick={onClick} className='titlePage' icon={<IconTitlePage />} />
    </div>
  );
};

export default TitlePage;
