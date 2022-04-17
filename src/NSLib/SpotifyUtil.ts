export function getSpotifyTrackId(url: string) {
    const m = url.match(/(?<=k\/)(.*(?=\?)|.*(?=$)*)/g);
    if (m == null) return "";
    return m[0];
}
  
export function getSpotifyPlaylistId(url: string) {
    const m = url.match(/(?<=t\/)(.*(?=\?)|.*(?=$)*)/g);
    if (m == null) return "";
    return m[0];
}