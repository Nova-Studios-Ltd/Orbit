import { PauseCircleFilled, PlayCircleFilled, VolumeUp } from "@mui/icons-material";
import { Typography, useTheme } from "@mui/material";
import { time } from "console";
import moment, { duration } from "moment";
import { useEffect, useRef, useState } from "react";
import TimeBar from "../TimeBar/TimeBar";

export interface AudioProps {
  src?: string,
  filename?: string
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
  const [newVolume, setNewVolume] = useState<number | undefined>(undefined);
  const [volume, setVolume] = useState(1);

  const setAudioData = () => {
    if (!audio.current) return;
    setDuration(audio.current.duration);
    setPosition(audio.current.currentTime);
  }

  const setAudioTime = () => {
    if (!audio.current) return;
    if (audio.current.currentTime >= duration) {
      setPlaying(false);
      setPosition(0);
      return;
    }
    setPosition(audio.current.currentTime);
  }

  const setVolumeSlider = (show: boolean) => {
    if (volumeSliderContainer.current) {
      volumeSliderContainer.current.style.display = (show) ? "flex" : "none";
    }
  }

  if (audio.current) playing ? audio.current.play() : audio.current.pause();
  if (audio.current && newPosition && audio.current.currentTime !== newPosition) {
    audio.current.currentTime = newPosition;
    setPosition(audio.current.currentTime);
    setNewPosition(undefined);
  }

  if (audio.current && newVolume !== undefined && audio.current.volume !== newVolume) {
    audio.current.volume = newVolume;
    console.log(newVolume);
    setVolume(Math.random());
    setNewVolume(undefined);
  }

  function calcClickedTime(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const clickPositionInPage = e.pageY;
    if (volumeSlider.current === null) return 0;
    const barStart = volumeSlider.current.getBoundingClientRect().top + window.scrollY;
    const barHeight = volumeSlider.current.offsetHeight;
    const clickPositionInBar = (clickPositionInPage - barStart);
    const timePerPixel = 1 / barHeight;
    let time = timePerPixel * clickPositionInBar
    /*if (time > 1) return 1;*/
    /*if (time < 0) return 0;*/
    return time;
  }

  function handleTimeDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setNewVolume(calcClickedTime(e));

    const updateTimeOnMove = (eMove: any) => {
      setNewVolume(calcClickedTime(eMove));
    }

    document.addEventListener("mousemove", updateTimeOnMove);
    document.addEventListener("mouseup", () => document.removeEventListener("mousemove", updateTimeOnMove));
  }

  console.log(volume);
  return (
    <div className="player" style={{ backgroundColor: theme.palette.background.default }}>
      <audio ref={audio} onLoadedData={setAudioData} onTimeUpdate={setAudioTime}>
        <source src={props.src} />
      </audio>
      <div className="player_display">
        <div className="player_display_title">
          <Typography variant="subtitle1"> {(props.filename) ? props.filename : "Unknown Track"}</Typography>
        </div>
      </div>
      <div className="player_controls">
        <button className="player_button" onClick={() => setPlaying(!playing)}>
          {(!playing) ? (<PlayCircleFilled fontSize="large" />) : (<PauseCircleFilled fontSize="large" />)}
        </button>
        <div onMouseOver={() => setVolumeSlider(true)} onMouseLeave={() => setVolumeSlider(false)}
          className="player_volume_container">
          <VolumeUp className="player_volume" />
          <div ref={volumeSliderContainer} className="player_volume_slider">
            <div ref={volumeSlider} className="volume_bar_progress" style={{ background: `linear-gradient(to top, orange ${((volume / 1) * 100)}%, white 0)` }} onMouseDown={e => handleTimeDrag(e)}>
            </div>
            <span className="volume_bar_progress_knob" style={{ bottom: `${((volume / 1) * 100) - 2}%` }} />
          </div>
        </div>
        <TimeBar duration={duration} curTime={position} onTimeUpdate={(s: number) => { setNewPosition(s) }} />
      </div>
    </div>
  )
}

export default CustomAudio;
