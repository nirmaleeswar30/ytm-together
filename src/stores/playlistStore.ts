import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Playlist, PlaylistItem } from '../types';

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  items: PlaylistItem[];
  loading: boolean;
  fetchPlaylists: (roomId: string) => Promise<void>;
  createPlaylist: (roomId: string, name: string) => Promise<void>;
  addItem: (playlistId: string, youtubeUrl: string, title: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  reorderItems: (playlistId: string, items: PlaylistItem[]) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  currentPlaylist: null,
  items: [],
  loading: false,

  fetchPlaylists: async (roomId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    set({ playlists: data || [], loading: false });
  },

  createPlaylist: async (roomId: string, name: string) => {
    const { data, error } = await supabase
      .from('playlists')
      .insert([{ room_id: roomId, name }])
      .select();

    if (error) throw error;
    set((state) => ({ playlists: [...state.playlists, data[0]] }));
  },

  addItem: async (playlistId: string, youtubeUrl: string, title: string) => {
    const { data: existingItems } = await supabase
      .from('playlist_items')
      .select('position')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: false })
      .limit(1);

    const position = existingItems?.[0]?.position ?? 0;

    const { error } = await supabase
      .from('playlist_items')
      .insert([{
        playlist_id: playlistId,
        youtube_url: youtubeUrl,
        title,
        position: position + 1,
      }]);

    if (error) throw error;
  },

  removeItem: async (itemId: string) => {
    const { error } = await supabase
      .from('playlist_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  },

  reorderItems: async (playlistId: string, items: PlaylistItem[]) => {
    const updates = items.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    const { error } = await supabase
      .from('playlist_items')
      .upsert(updates);

    if (error) throw error;
    set({ items });
  },
}));