import React from 'react';
import { PlaylistItem } from '../../types';
import { GripVertical, Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  item: PlaylistItem;
  onRemove: (id: string) => void;
}

export default function DraggablePlaylistItem({ item, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-2 bg-white hover:bg-gray-50 rounded-md"
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="touch-none">
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <span className="text-gray-900">{item.title}</span>
      </div>
      
      <button
        onClick={() => onRemove(item.id)}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash className="h-4 w-4" />
      </button>
    </div>
  );
}