import { v4 as uuid } from 'uuid';
import { Home, ZingChart, LibraryMusic, NewRelease, Album, DetailsArtist, NewMusic, Top100, SearchPage } from '~/page';
import path from './path';
import HistorySong from '~/components/HistorySong';
import UserPlayList from '~/components/UserPlayList';
import LibraryMusicArtists from '~/components/LibraryMusicArtists';
import { DetailsArtistPanel, Video, ZingChartRanks } from '~/components';
import {
  IconHome,
  IconZingChart,
  IconLibrary,
  IconStar,
  IconNoteMusic,
  IconAlbum,
  IconHistory,
  IconLoveSong,
  IconPlayList,
  IconUpload,
} from '~/asset/logo';
import Songs from '~/page/SearchPage/Songs';
import Playlist from '~/page/SearchPage/PlayLists';
import Artists from '~/page/SearchPage/Artists';
import Mv from '~/page/SearchPage/Mv';
import AllSearch from '~/page/SearchPage/AllSearch';
const menuNavigate = [
  { id: uuid(), path: path.HOME, content: 'Khám Phá', icon: IconHome },
  { id: uuid(), path: path.ZING_CHART, content: '#zingchart', icon: IconZingChart },
  { id: uuid(), path: path.LIBRARY_MUSIC, content: 'Thư Viện', icon: IconLibrary },
];
const menuRanks = [
  { id: uuid(), path: path.NEW_MUSIC, content: 'BXH nhạc mới', icon: IconNoteMusic },
  { id: uuid(), path: path.TOP_100, content: 'Top 100', icon: IconStar },
];
const router = [
  { id: uuid(), path: path.HOME, component: Home },
  {
    id: uuid(),
    path: path.ZING_CHART,
    component: ZingChart,
    insideRoute: [{ id: uuid(), path: path.ZING_CHART + path.ZING_CHART_RANKS, component: ZingChartRanks }],
  },
  {
    id: uuid(),
    path: path.ALBUM,
    component: Album,
  },
  {
    id: uuid(),
    path: path.PLAY_LIST,
    component: Album,
  },
  {
    id: uuid(),
    path: path.DETAILS_ARTIST,
    component: DetailsArtist,
    insideRoute: [
      { id: uuid(), path: path.DETAILS_ARTIST + path.DETAILS_ARTIST_PANEL, component: DetailsArtistPanel },
      { id: uuid(), path: path.DETAILS_ARTIST + path.OPEN_VIDEO, component: Video },
    ],
  },
  {
    id: uuid(),
    path: path.NEW_RELEASE,
    component: NewRelease,
    insideRoute: [{ id: uuid(), path: path.NEW_RELEASE + path.SONG, component: HistorySong }],
  },
  {
    id: uuid(),
    path: path.NEW_MUSIC,
    component: NewMusic,
  },
  {
    id: uuid(),
    path: path.TOP_100,
    component: Top100,
  },
  {
    id: uuid(),
    path: path.LIBRARY_MUSIC,
    component: LibraryMusic,
    insideRoute: [
      { id: uuid(), path: path.LIBRARY_MUSIC + path.HISTORY, icon: IconHistory, component: HistorySong, content: 'Nghe gần đây' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.LOVE_SONG, icon: IconLoveSong, component: '', content: 'Bài hát yêu thích' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.USER_PLAY_LIST, icon: IconPlayList, component: UserPlayList, content: 'Playlist' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.USER_ALBUM, icon: IconAlbum, component: '', content: 'Album' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.UPLOAD, icon: IconUpload, component: '', content: 'Đã tải lên' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.ARTISTS, icon: '', component: LibraryMusicArtists, content: '' },
    ],
  },
  {
    id: uuid(),
    path: path.SEARCH,
    component: SearchPage,
    insideRoute: [
      { id: uuid(), path: path.SEARCH + path.SEARCH_ALL, component: AllSearch, content: 'tất cả' },
      { id: uuid(), path: path.SEARCH + path.SEARCH_SONG, component: Songs, content: 'bài hát' },
      { id: uuid(), path: path.SEARCH + path.SEARCH_PLAYLIST, component: Playlist, content: 'playlist/album' },
      { id: uuid(), path: path.SEARCH + path.SEARCH_ARTIST, component: Artists, content: 'nghệ sĩ/oa' },
      { id: uuid(), path: path.SEARCH + path.SEARCH_MV, component: Mv, content: 'mv' },
    ],
  },
];
const menuRouteUser = router.find((route) => route.path === path.LIBRARY_MUSIC);
export { router, menuNavigate, menuRanks, menuRouteUser };
