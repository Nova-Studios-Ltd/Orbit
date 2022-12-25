export enum PlatformType {
  Youtube,
  Spotify,
  Unknown
}

export class PlatformParser {
  readonly YOUTUBE = /^(https:\/\/www\.youtube\.com\/[a-zA-Z?0-9=&]*)|^(https:\/\/youtu\.be\/[a-zA-z?0-9=&]*)/g;
  readonly SPOTIFY = /^https:\/\/open\.spotify\.com\/[a-zA-Z?0-9=&/]*/g;

  readonly YOUTUBE_REGEX: RegExp;
  readonly SPOTIFY_REGEX: RegExp;

  readonly URL: string

  constructor(url: string) {
    this.URL = url;
    this.YOUTUBE_REGEX = new RegExp(this.YOUTUBE);
    this.SPOTIFY_REGEX = new RegExp(this.SPOTIFY);
  }

  getPlatform() : PlatformType {
    if (this.YOUTUBE_REGEX.test(this.URL)) return PlatformType.Youtube;
    else if (this.SPOTIFY_REGEX.test(this.URL)) return PlatformType.Spotify;
    else return PlatformType.Unknown;
  }
}
