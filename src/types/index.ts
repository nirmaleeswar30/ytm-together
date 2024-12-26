export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  current_song?: {
    url: string;
    title: string;
    timestamp: number;
    isPlaying: boolean;
  };
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'owner' | 'moderator' | 'participant';
  joined_at: string;
  profile: Profile;
}

export interface Playlist {
  id: string;
  room_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItem {
  id: string;
  playlist_id: string;
  youtube_url: string;
  title: string;
  thumbnail_url?: string;
  duration?: string;
  position: number;
  added_by?: string;
  created_at: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
}