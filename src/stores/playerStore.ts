import { create } from 'zustand';
import { socket } from '../lib/socket';

interface PlayerState {
  player: any;
  currentSong: {
    url: string;
    title: string;
    timestamp: number;
  } | null;
  isPlaying: boolean;
  setPlayer: (player: any) => void;
  updatePlaybackState: (isPlaying: boolean) => void;
  syncPlayback: (timestamp: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  currentSong: null,
  isPlaying: false,

  setPlayer: (player) => set({ player }),

  updatePlaybackState: (isPlaying) => {
    set({ isPlaying });
    socket.emit('playback_state', { isPlaying });
  },

  syncPlayback: (timestamp) => {
    const { player } = get();
    if (player) {
      player.seekTo(timestamp);
    }
  },
}));