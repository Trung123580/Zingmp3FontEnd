import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { apiSearch } from '~/api';
import { isScrollTop } from '~/store/actions/dispatch';
const SearchProvider = createContext();
const ContextSearch = ({ children }) => {
  const [stateSearch, setStateSearch] = useState({
    isLoading: true,
    isError: false,
    searchData: null, // {}
  });
  //   const { pathname } = useLocation();
  const { keyWord } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!keyWord) return;
    const getSearch = async () => {
      if (!stateSearch.isLoading) setStateSearch((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await apiSearch(keyWord);
        if (response.data?.err === 0) {
          dispatch(isScrollTop(true));
          setStateSearch((prev) => ({ ...prev, isLoading: false, searchData: response.data?.data }));
        } else {
          setStateSearch((prev) => ({ ...prev, isError: true }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSearch();
    return () => {
      dispatch(isScrollTop(false));
    };
    // eslint-disable-next-line
  }, [keyWord]);
  return (
    <SearchProvider.Provider
      value={{
        stateSearch: stateSearch,
      }}>
      {children}
    </SearchProvider.Provider>
  );
};

export { ContextSearch, SearchProvider };
