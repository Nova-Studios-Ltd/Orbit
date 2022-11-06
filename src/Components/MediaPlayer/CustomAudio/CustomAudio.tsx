import { PauseCircleFilled, PlayCircleFilled, VolumeUp } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import TimeBar from "../TimeBar/TimeBar";

export interface AudioProps {
  src?: string,
  filename?: string,
  type?: string
}

function CustomAudio(props: AudioProps) {
  const theme = useTheme();

  const audio = useRef<HTMLAudioElement>(null);
  const volumeSlider = useRef<HTMLDivElement>(null);
  const volumeSliderContainer = useRef<HTMLDivElement>(null);

  // Player position/playing state
  const [position, setPosition] = useState(0);
  const [newPosition, setNewPosition] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Player volume state
  const [volume, setVolume] = useState(0.5);

  const [safariInit, setSafariInit] = useState(false);
  const [hasFirmlyGrippedKnob, setGrabKnob] = useState(false);

  const setAudioData = () => {
    if (!audio.current) return;
    setDuration(audio.current.duration);
    setPosition(audio.current.currentTime);
  }

  const setVolumeSlider = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, show: boolean) => {
    if (volumeSliderContainer.current) {
      volumeSliderContainer.current.style.display = (show) ? "flex" : "none";
      event.currentTarget.style.color = (show)? theme.customPalette.SystemAccentColor : "white";
    }
  }

  useEffect(() => {
    if (!audio.current) return;

    if (audio.current.currentTime >= duration && playing) {
      setPlaying(false);
      setNewPosition(0);
    }

    playing ? audio.current.play() : audio.current.pause();

    if (audio.current.volume !== volume) {
      audio.current.volume = volume;
    }

    if (newPosition !== undefined) {
      audio.current.currentTime = newPosition;
      setNewPosition(undefined);
    }

    if (audio.current.currentTime !== position) {
      setPosition(audio.current.currentTime);
    }

  }, [volume, position, playing, duration, newPosition]);

  function calcClickedVolume(e: React.MouseEvent<HTMLDivElement | HTMLSpanElement, MouseEvent>) {
    const clickPositionInPage = e.pageY;
    if (volumeSlider.current === null) return 0;
    const barStart = volumeSlider.current.getBoundingClientRect().bottom + window.scrollY;
    const barHeight = volumeSlider.current.offsetHeight;
    const clickPositionInBar = (clickPositionInPage - barStart);
    const timePerPixel = 1 / barHeight;
    let time = (timePerPixel * clickPositionInBar) * -1;
    if (time > 1) return 1;
    if (time < 0) return 0;
    return time;
  }

  function handleVolumeDrag(e: React.MouseEvent<HTMLDivElement | HTMLSpanElement, MouseEvent>) {
    if (!hasFirmlyGrippedKnob) return;
    const newVolume = calcClickedVolume(e);
    setVolume(newVolume);
  }

  const onPlayPauseButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!safariInit && audio.current) {
      audio.current.muted = false;
      audio.current.play();
      setPlaying(true);
      setSafariInit(true);
      return;
    }
    setPlaying(!playing);
  }

  return (
    <div className="player" style={{ backgroundColor: theme.palette.background.default }}>
      <audio ref={audio} style={{display: "none"}} onLoadedData={setAudioData} onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}>
        <source src={props.src} type={props.type} />
      </audio>
      <div className="player_display">
        <div className="player_display_title">
          <Typography variant="subtitle1"> {(props.filename) ? props.filename : "Unknown Track"}</Typography>
        </div>
      </div>
      <div className="player_controls">
        <button className="player_button" onMouseOver={(e) => e.currentTarget.style.color = theme.customPalette.SystemAccentColor} onMouseLeave={(e) => e.currentTarget.style.color = "white"} onClick={onPlayPauseButtonClick}>
          {(!playing) ? (<PlayCircleFilled fontSize="large" />) : (<PauseCircleFilled fontSize="large" />)}
        </button>
        <div onMouseOver={(e) => setVolumeSlider(e, true)} onMouseLeave={(e) => { setVolumeSlider(e, false); setGrabKnob(false); }}
          className="player_volume_container" style={{ color: "white" }}>
          <VolumeUp className="player_volume" />
          <div ref={volumeSliderContainer} className="player_volume_slider">
            <div ref={volumeSlider} className="volume_bar_progress" style={{ background: `linear-gradient(to top, ${theme.customPalette.SystemAccentColor} ${((volume / 1) * 100)}%, white 0)` }} onMouseDown={(e) => { setGrabKnob(true); setVolume(calcClickedVolume(e)); }} onMouseUp={() => setGrabKnob(false)} onMouseMove={handleVolumeDrag}>
            </div>
            <span className="volume_bar_progress_knob" style={{ bottom: `${((volume / 1) * 100) - 2}%` }} onMouseDown={() => setGrabKnob(true)} onMouseMove={handleVolumeDrag} onMouseUp={() => setGrabKnob(false)} />
          </div>
        </div>
        <TimeBar duration={duration} curTime={position} onTimeUpdate={(s: number) => { setNewPosition(s) }} />
      </div>
    </div>
  )
}

export default CustomAudio;
