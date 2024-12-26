import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Room, RoomMember } from '../types';

interface RoomState {
  rooms: Room[];
  currentRoom: Room | null;
  members: RoomMember[];
  loading: boolean;
  fetchRooms: () => Promise<void>;
  createRoom: (name: string, isPrivate: boolean) => Promise<Room>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  fetchRoomMembers: (roomId: string) => Promise<void>;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  currentRoom: null,
  members: [],
  loading: false,

  fetchRooms: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    set({ rooms: data || [], loading: false });
  },

  createRoom: async (name: string, isPrivate: boolean) => {
    const { data, error } = await supabase
      .from('rooms')
      .insert([{ name, is_private: isPrivate }])
      .select()
      .single();

    if (error) throw error;
    set((state) => ({ rooms: [data, ...state.rooms] }));
    return data;
  },

  joinRoom: async (roomId: string) => {
    const { error } = await supabase
      .from('room_members')
      .insert([{ room_id: roomId }]);

    if (error) throw error;
    await get().fetchRoomMembers(roomId);
  },

  leaveRoom: async (roomId: string) => {
    const { error } = await supabase
      .from('room_members')
      .delete()
      .eq('room_id', roomId);

    if (error) throw error;
    set((state) => ({
      members: state.members.filter((m) => m.room_id !== roomId),
      currentRoom: null,
    }));
  },

  fetchRoomMembers: async (roomId: string) => {
    const { data, error } = await supabase
      .from('room_members')
      .select('*, profile:profiles(*)')
      .eq('room_id', roomId);

    if (error) throw error;
    set({ members: data || [] });
  },
}));