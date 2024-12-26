import React from 'react';
import { RoomMember } from '../../types';
import { Users, Crown, Shield } from 'lucide-react';

interface Props {
  members: RoomMember[];
}

export default function MembersList({ members }: Props) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Users className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Room Members</h2>
      </div>
      
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between">
            <span className="text-gray-900">{member.profile.username}</span>
            {getRoleIcon(member.role)}
          </li>
        ))}
      </ul>
    </div>
  );
}