import React from 'react';
import classNames from 'classnames/bind';
import style from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
const cx = classNames.bind(style);
const Search = ({ themeApp }) => {
  return (
    <form className={cx('search')}>
      <div className={cx('search-container')} style={{ color: themeApp?.primaryColor }}>
        <label htmlFor='search'>
          <SearchIcon fontSize='large' />
        </label>
        <input
          type='text'
          id='search'
          style={{ color: themeApp?.primaryColor }}
          autoComplete='off'
          placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát...'
        />
      </div>
      <div className='suggest_list'>{/* render suggest_list end result search */}</div>
    </form>
  );
};

export default Search;
