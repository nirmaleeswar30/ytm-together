import React from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { Play, Pause, SkipForward } from 'lucide-react';

export default function PlayerControls() {
  const { player, isPlaying, currentSong } = usePlayerStore();
  const { updatePlaybackState } = usePlayerStore();

  const togglePlayback = () => {
    if (!player || !currentSong) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    updatePlaybackState(!isPlaying);
  };

  const skipSong = () => {
    // Implement skip functionality with playlist integration
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <button
        onClick={togglePlayback}
        className="p-2 rounded-full hover:bg-gray-100"
        disabled={!currentSong}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8 text-gray-700" />
        ) : (
          <Play className="h-8 w-8 text-gray-700" />
        )}
      </button>
      
      <button
        onClick={skipSong}
        className="p-2 rounded-full hover:bg-gray-100"
        disabled={!currentSong}
      >
        <SkipForward className="h-8 w-8 text-gray-700" />
      </button>
    </div>
  );
}