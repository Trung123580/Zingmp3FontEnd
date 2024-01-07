import React, { forwardRef } from 'react';
import ReactPlayer from 'react-player';
import { BsPlayCircle } from 'react-icons/bs';
const VideoPlayer = forwardRef(({ dataVideo, sourceVideo, isPlay, onPlay, onPause, onProgress, volume }, ref) => {
  return (
    <ReactPlayer
      light={dataVideo?.thumbnailM}
      playing={isPlay}
      onPlay={onPlay}
      onPause={onPause}
      onProgress={onProgress}
      loop={false}
      url={sourceVideo}
      config={{
        hls: {
          enableLowInitialPlaylist: true,
        },
      }}
      // controls={true}
      volume={volume}
      ref={ref}
      muted={false}
      playIcon={<BsPlayCircle fontSize='5rem' />}
      style={{ borderRadius: '4px' }}
      pip={false}
      height='100%'
      width='100%'
    />
  );
});
export default VideoPlayer;
