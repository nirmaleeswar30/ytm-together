import { YouTubeVideo } from '../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export function extractVideoId(url: string): string | null {
  try {
    const videoId = new URL(url).searchParams.get('v');
    return videoId;
  } catch {
    return null;
  }
}

export async function getVideoDetails(url: string): Promise<YouTubeVideo | null> {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (!data.items?.[0]) return null;

    const { snippet, contentDetails } = data.items[0];
    return {
      id: videoId,
      title: snippet.title,
      thumbnailUrl: snippet.thumbnails.default.url,
      duration: contentDetails.duration,
    };
  } catch (error) {
    console.error('Failed to fetch video details:', error);
    return null;
  }
}