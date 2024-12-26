import React, { useState } from 'react';
import { usePlaylistStore } from '../../stores/playlistStore';
import { PlaylistItem } from '../../types';
import { Music, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggablePlaylistItem from './DraggablePlaylistItem';

export default function PlaylistManager() {
  const [url, setUrl] = useState('');
  const { items, addItem, removeItem, reorderItems } = usePlaylistStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Extract video title from URL (in production, you'd want to use YouTube API)
      const title = 'Song Title';
      await addItem(items[0]?.playlist_id, url, title);
      setUrl('');
    } catch (error) {
      console.error('Failed to add song:', error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = [...items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      
      reorderItems(items[0].playlist_id, newItems);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Music className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-semibold">Playlist</h2>
      </div>

      <form onSubmit={handleAddSong} className="mb-4">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="YouTube URL"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {items.map((item) => (
              <DraggablePlaylistItem
                key={item.id}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}