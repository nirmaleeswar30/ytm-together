/*
  # Initial Schema Setup for Sync Music App

  1. New Tables
    - `profiles`: Extended user profile information
    - `rooms`: Music rooms
    - `room_members`: Junction table for room membership and roles
    - `playlists`: Room playlists
    - `playlist_items`: Individual songs in playlists

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'moderator', 'participant');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_private boolean DEFAULT false,
  current_song jsonb
);

-- Create room_members table
CREATE TABLE IF NOT EXISTS room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role DEFAULT 'participant',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create playlist_items table
CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  youtube_url text NOT NULL,
  title text NOT NULL,
  thumbnail_url text,
  duration text,
  position integer NOT NULL,
  added_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, position)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Rooms policies
CREATE POLICY "Rooms are viewable by members"
  ON rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = rooms.id
      AND room_members.user_id = auth.uid()
    )
    OR NOT is_private
  );

CREATE POLICY "Authenticated users can create rooms"
  ON rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room owners and moderators can update rooms"
  ON rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = rooms.id
      AND room_members.user_id = auth.uid()
      AND room_members.role IN ('owner', 'moderator')
    )
  );

-- Room members policies
CREATE POLICY "Room members are viewable by room members"
  ON room_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM room_members rm
      WHERE rm.room_id = room_members.room_id
      AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join public rooms"
  ON room_members FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM rooms
      WHERE rooms.id = room_id
      AND rooms.is_private = true
    )
  );

-- Playlist policies
CREATE POLICY "Playlists are viewable by room members"
  ON playlists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = playlists.room_id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room owners and moderators can manage playlists"
  ON playlists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = playlists.room_id
      AND room_members.user_id = auth.uid()
      AND room_members.role IN ('owner', 'moderator')
    )
  );

-- Playlist items policies
CREATE POLICY "Playlist items are viewable by room members"
  ON playlist_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      JOIN playlists ON playlists.room_id = room_members.room_id
      WHERE playlists.id = playlist_items.playlist_id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room owners and moderators can manage playlist items"
  ON playlist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM room_members
      JOIN playlists ON playlists.room_id = room_members.room_id
      WHERE playlists.id = playlist_items.playlist_id
      AND room_members.user_id = auth.uid()
      AND room_members.role IN ('owner', 'moderator')
    )
  );