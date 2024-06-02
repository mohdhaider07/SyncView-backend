// @ts-ignore
import ytPlaylist from "youtube-playlist";

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
export async function getPlaylistVideos(playlistUrl: string) {
  console.log("playlist url", playlistUrl);
  const videoUrls = await ytPlaylist(playlistUrl, ["name", "url"]);
  console.log("video url", videoUrls);

  return videoUrls;
}
