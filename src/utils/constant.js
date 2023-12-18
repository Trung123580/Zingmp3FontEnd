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
export { listTheme, listBtnNewRelease, navChart };
