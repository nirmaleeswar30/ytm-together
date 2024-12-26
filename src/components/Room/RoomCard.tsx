import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { Users, Lock, Unlock } from 'lucide-react';

interface Props {
  room: Room;
}

export default function RoomCard({ room }: Props) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/room/${room.id}`)}
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
        {room.is_private ? (
          <Lock className="h-5 w-5 text-gray-500" />
        ) : (
          <Unlock className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      <div className="mt-4 flex items-center text-sm text-gray-500">
        <Users className="h-4 w-4 mr-1" />
        <span>Created {new Date(room.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}