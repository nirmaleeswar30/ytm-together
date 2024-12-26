import { socket } from './socket';
import { usePlayerStore } from '../stores/playerStore';
import { useNotificationStore } from '../stores/notificationStore';
import { usePlaylistStore } from '../stores/playlistStore';

export function initializeSocketEvents() {
  const { syncPlayback } = usePlayerStore.getState();
  const { addNotification } = useNotificationStore.getState();
  const { updateItems } = usePlaylistStore.getState();

  socket.on('playback_state_changed', ({ isPlaying, timestamp }) => {
    usePlayerStore.setState({ isPlaying });
    if (timestamp) syncPlayback(timestamp);
  });

  socket.on('playlist_updated', ({ items }) => {
    updateItems(items);
  });

  socket.on('user_joined', ({ username }) => {
    addNotification(`${username} joined the room`);
  });

  socket.on('user_left', ({ username }) => {
    addNotification(`${username} left the room`);
  });

  socket.on('role_changed', ({ username, role }) => {
    addNotification(`${username}'s role was changed to ${role}`);
  });

  return () => {
    socket.off('playback_state_changed');
    socket.off('playlist_updated');
    socket.off('user_joined');
    socket.off('user_left');
    socket.off('role_changed');
  };
}