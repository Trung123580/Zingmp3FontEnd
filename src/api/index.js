import axios from '../axios';
export const apiHome = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: '/home',
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
export const apiDetailsPlayList = async (playListId) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/detailplaylist',
      params: { id: playListId },
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
export const apiSong = async (songId) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/song',
      params: { id: songId },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
export const apiInfoSong = async (songId) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/infosong',
      params: { id: songId },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// video ???
export const apiVideoArtist = async (videoId) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/video',
      params: { id: videoId },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// danh sach
export const newReleaseChart = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'newreleasechart',
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
//danh sach zing chart
export const chartHome = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'charthome',
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const apiGetArtist = async (name) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/artist',
      params: { name: name },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const apiListMv = async (id, page, count) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/listmv',
      params: { id: id, page: page, count: count },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// lyric

export const apiLyricSong = async (id) => {
  try {
    const response = await axios({
      method: 'get',
      url: '/lyric',
      params: { id: id },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// TOP_100
export const apiTop100 = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'top100',
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
// export const apiCategoryMV = async (id) => {
//    try {
//      const response = await axios({
//        method: 'get',
//        url: '/categorymv',
//        params: { id: id },
//      });
//      return response;
//    } catch (error) {
//      throw new Error(error);
//    }
// }
