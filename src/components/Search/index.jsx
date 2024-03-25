import React from 'react';
import classNames from 'classnames/bind';
import style from './Search.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { v4 as uuid } from 'uuid';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
const cx = classNames.bind(style);
const Search = (props) => {
  const { themeApp, onKeySearch, search, onSubmitSearch, onRefresh, isSuggest, onFocusSuggest, searchList, onSearch, onDeleteSearch } = props;

  return (
    <form
      className={cx('search', {
        isSuggest: isSuggest && searchList?.length,
      })}
      method='get'
      // action='/search'
      onSubmit={onSubmitSearch}>
      <div className={cx('search-container')} style={{ color: themeApp?.primaryColor }} onClick={(e) => e.stopPropagation()}>
        <label htmlFor='search'>
          <SearchIcon fontSize='large' />
        </label>
        <input
          type='text'
          id='search'
          value={search}
          onChange={(e) => onKeySearch(e.target.value)}
          style={{ color: themeApp?.primaryColor }}
          onFocus={onFocusSuggest}
          // onBlur={onBlurSuggest}
          autoComplete='off'
          placeholder='Tìm kiếm bài hát, nghệ sĩ, lời bài hát...'
        />
        {!!search && <CloseRoundedIcon fontSize='large' sx={{ cursor: 'pointer' }} onClick={onRefresh} />}
      </div>
      {isSuggest && !!searchList?.length && (
        <div className={cx('suggest_list')}>
          <h4 className={cx('title')}>Lịch sử tìm kiếm</h4>
          <ul className={cx('list')}>
            {searchList.map((item) => (
              <li
                key={uuid()}
                className={cx('item', {
                  active: search === item,
                })}
                onClick={(e) => onSearch(e, item.trim())}>
                <ScheduleRoundedIcon />
                <span>{item}</span>
                <p className={cx('position')} onClick={(e) => onDeleteSearch(e, item.trim())}>
                  <CloseRoundedIcon />
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default Search;
