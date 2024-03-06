import { v4 as uuid } from 'uuid';
import { Home, ZingChart, LibraryMusic, NewRelease, Album, DetailsArtist, NewMusic, Top100 } from '~/page';
import path from './path';
import HistorySong from '~/components/HistorySong';
import LoveSong from '~/components/LoveSong';
import AlbumUser from '~/components/AlbumUser';
import UserPlayList from '~/components/UserPlayList';
import UploadedSongs from '~/components/UploadedSongs';
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
      { id: uuid(), path: path.LIBRARY_MUSIC + path.LOVE_SONG, icon: IconLoveSong, component: LoveSong, content: 'Bài hát yêu thích' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.USER_PLAY_LIST, icon: IconPlayList, component: UserPlayList, content: 'Playlist' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.USER_ALBUM, icon: IconAlbum, component: AlbumUser, content: 'Album' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.UPLOAD, icon: IconUpload, component: UploadedSongs, content: 'Đã tải lên' },
      { id: uuid(), path: path.LIBRARY_MUSIC + path.ARTISTS, icon: null, component: LibraryMusicArtists, content: '' },
    ],
  },
];
const menuRouteUser = router.find((route) => route.path === path.LIBRARY_MUSIC);
export { router, menuNavigate, menuRanks, menuRouteUser };
