import { forwardRef } from 'react';
import ReactPlayer from 'react-player';
import { BsPlayCircle } from 'react-icons/bs';
const VideoPlayer = forwardRef(
  (
    {
      pip,
      onEnablePIP,
      onStart,
      light,
      onDisablePIP,
      onEnded,
      sourceVideo,
      isPlay,
      onPlay,
      onPause,
      onProgress,
      volume,
      onReady,
      onBuffer,
      onBufferEnd,
    },
    ref
  ) => {
    return (
      <ReactPlayer
        light={light}
        stopOnUnmount={false}
        playing={isPlay}
        onPlay={onPlay}
        onPause={onPause}
        onProgress={onProgress}
        loop={false}
        onStart={onStart}
        url={sourceVideo}
        onReady={onReady}
        onBuffer={onBuffer}
        onEnded={onEnded}
        onBufferEnd={onBufferEnd}
        onEnablePIP={onEnablePIP}
        onDisablePIP={onDisablePIP}
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
        pip={pip}
        height='100%'
        width='100%'
      />
    );
  }
);
export default VideoPlayer;
