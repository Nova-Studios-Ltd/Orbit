import React from "react";
import { getSpotifyPlaylistId, getSpotifyTrackId } from "../../NSLib/SpotifyUtil";
import { OpenCustomProto } from "../../NSLib/Util";

export interface ICustomLink {
    url: string
}

export class CustomLink extends React.Component<ICustomLink> {

    constructor(props: ICustomLink) {
        super(props);
        this.OnClick = this.OnClick.bind(this);
    }

    async OnClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        event.preventDefault();
        if (this.props.url.includes("spotify")) {
            if (this.props.url.includes("track")) {
                if (!await OpenCustomProto(`spotify://track/${getSpotifyTrackId(this.props.url)}`)) window.open(this.props.url, "_blank");
            }
            else if (this.props.url.includes("playlist")) {
                if (!await OpenCustomProto(`spotify://playlist/${getSpotifyPlaylistId(this.props.url)}`)) window.open(this.props.url, "_blank");
            }
            else {
                window.open(this.props.url, "_blank");
            }
        }
        else {
            window.open(this.props.url, "_blank");
        }
    }

    render() {
        return (
            <a onClick={this.OnClick} href={this.props.url}>{this.props.url}</a>
        );
    }
}