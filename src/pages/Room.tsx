import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRoomStore } from '../stores/roomStore';
import { usePlaylistStore } from '../stores/playlistStore';
import YouTubePlayer from '../components/Player/YouTubePlayer';
import MembersList from '../components/Room/MembersList';
import PlaylistManager from '../components/Playlist/PlaylistManager';
import { socket } from '../lib/socket';

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const { currentRoom, members, fetchRoomMembers } = useRoomStore();
  const { playlists, fetchPlaylists } = usePlaylistStore();

  useEffect(() => {
    if (id) {
      fetchRoomMembers(id);
      fetchPlaylists(id);
      
      socket.emit('join_room', { roomId: id });
      
      return () => {
        socket.emit('leave_room', { roomId: id });
      };
    }
  }, [id, fetchRoomMembers, fetchPlaylists]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <YouTubePlayer />
        <PlaylistManager />
      </div>
      
      <div className="space-y-6">
        <MembersList members={members} />
      </div>
    </div>
  );
}