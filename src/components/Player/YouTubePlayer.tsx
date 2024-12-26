import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { socket } from '../../lib/socket';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer() {
  const playerRef = useRef<any>(null);
  const { currentSong, isPlaying, setPlayer, updatePlaybackState } = usePlayerStore();

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: '',
        playerVars: {
          playsinline: 1,
          controls: 0,
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
          },
          onStateChange: (event: any) => {
            updatePlaybackState(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };
  }, [setPlayer, updatePlaybackState]);

  useEffect(() => {
    if (playerRef.current && currentSong?.url) {
      const videoId = new URL(currentSong.url).searchParams.get('v');
      playerRef.current.loadVideoById(videoId, currentSong.timestamp);
      
      if (!isPlaying) {
        playerRef.current.pauseVideo();
      }
    }
  }, [currentSong, isPlaying]);

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <div id="youtube-player" />
    </div>
  );
}