import React from 'react';
import { useRoomStore } from '../../stores/roomStore';
import { RoomMember } from '../../types';
import { Shield, UserMinus } from 'lucide-react';

interface Props {
  member: RoomMember;
  isOwner: boolean;
}

export default function RoleManager({ member, isOwner }: Props) {
  const { updateMemberRole, removeMember } = useRoomStore();

  if (!isOwner || member.role === 'owner') return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={member.role}
        onChange={(e) => updateMemberRole(member.id, e.target.value as 'moderator' | 'participant')}
        className="text-sm rounded-md border-gray-300"
      >
        <option value="moderator">Moderator</option>
        <option value="participant">Participant</option>
      </select>
      
      <button
        onClick={() => removeMember(member.id)}
        className="text-gray-400 hover:text-red-500"
      >
        <UserMinus className="h-4 w-4" />
      </button>
    </div>
  );
}