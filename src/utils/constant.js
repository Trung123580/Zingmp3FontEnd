import { v4 as uuid } from 'uuid';
import {
  backgroundXone,
  backgroundZma,
  backgroundEiffel,
  backgroundWilop1,
  backgroundWilop2,
  backgroundXoneBar,
  backgroundZmaBar,
  backgroundDefaultBar,
  backgroundEiffelBar,
  backgroundWilop1Bar,
  backgroundDefault,
  backgroundWilop2Bar,
} from '~/asset';
const listTheme = [
  { id: uuid(), backgroundImage: backgroundDefault, color: '#9b4de0', name: 'mặc định', backgroundMusicBar: backgroundDefaultBar },
  { id: uuid(), backgroundImage: backgroundXone, color: '#E5BB00', name: 'Xone', backgroundMusicBar: backgroundXoneBar },
  { id: uuid(), backgroundImage: backgroundZma, color: '#ed2b91', name: 'Zma', backgroundMusicBar: backgroundZmaBar },
  { id: uuid(), backgroundImage: backgroundEiffel, color: '#c273ed', name: 'Eiffel', backgroundMusicBar: backgroundEiffelBar },
  { id: uuid(), backgroundImage: backgroundWilop1, color: '#50e3c2', name: 'Wilop1', backgroundMusicBar: backgroundWilop1Bar },
  { id: uuid(), backgroundImage: backgroundWilop2, color: '#E5BB00', name: 'Wilop2', backgroundMusicBar: backgroundWilop2Bar },
];
const listBtnNewRelease = [
  {
    id: uuid(),
    content: 'tất cả',
    active: 1,
    type: 'all',
  },
  {
    id: uuid(),
    content: 'việt nam',
    active: 2,
    type: 'vPop',
  },
  {
    id: uuid(),
    content: 'quốc tế',
    active: 3,
    type: 'others',
  },
];

const navChart = [
  { id: uuid(), path: 'vn', name: 'việt nam' },
  { id: uuid(), path: 'us', name: 'us-uk' },
  { id: uuid(), path: 'korea', name: 'k-pop' },
];

const listLibrary = [
  { id: uuid(), name: 'Bài hát', number: 0, path: '/love-song' },
  { id: uuid(), name: 'ALBUM', number: 1, path: '/user-album' },
  { id: uuid(), name: 'MV', number: 2, path: '' },
];

const listNavHistorySong = [
  { id: uuid(), name: 'Bài hát', number: 0 },
  { id: uuid(), name: 'Playlist', number: 1 },
  { id: uuid(), name: 'mv', number: 2 },
];
const listKeyVideo = [
  {
    key: 'Digit0',
    coords: 1,
  },
  {
    key: 'Digit1',
    coords: 0.9,
  },
  {
    key: 'Digit2',
    coords: 0.8,
  },
  {
    key: 'Digit3',
    coords: 0.7,
  },
  {
    key: 'Digit4',
    coords: 0.6,
  },
  {
    key: 'Digit5',
    coords: 0.5,
  },
  {
    key: 'Digit6',
    coords: 0.4,
  },
  {
    key: 'Digit7',
    coords: 0.3,
  },
  {
    key: 'Digit8',
    coords: 0.2,
  },
  {
    key: 'Digit9',
    coords: 0.1,
  },
];
const fontsLyric = [
  {
    text: 'A',
    fontSize: '1rem',
    id: uuid(),
  },
  {
    text: 'A',
    fontSize: '1.2rem',
    id: uuid(),
  },
  {
    text: 'A',
    fontSize: '1.3rem',
    id: uuid(),
  },
];

export { listTheme, listBtnNewRelease, navChart, listKeyVideo, fontsLyric, listLibrary, listNavHistorySong };
