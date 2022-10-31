import { Typography, useTheme } from "@mui/material";
import moment from "moment";
import { useRef } from "react";

export interface TimeBarProps {
  duration: number,
  curTime: number,
  onTimeUpdate: (seconds: number) => void
}

function TimeBar(props: TimeBarProps) {
  const theme = useTheme();
  const bar = useRef<HTMLDivElement>(null);

  let curPercentage = (props.curTime / props.duration) * 100;
  if (curPercentage > 100) curPercentage = 100;

  function formatDuration(duration: number) {
    const dur = moment.duration(duration, "seconds");
    return moment.utc(dur.asMilliseconds()).format("mm:ss");
  }

  function calcClickedTime(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const clickPositionInPage = e.pageX;
    if (bar.current === null) return 0;
    const barStart = bar.current.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.current.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = props.duration / barWidth;
    let time = timePerPixel * clickPositionInBar
    if (time > props.duration) time = props.duration;
    if (time < 0) props.duration = 0;
    return time;
  }

  function handleTimeDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    props.onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = (eMove: any) => {
      props.onTimeUpdate(calcClickedTime(eMove));
    }

    document.addEventListener("mousemove", updateTimeOnMove);
    document.addEventListener("mouseup", () => document.removeEventListener("mousemove", updateTimeOnMove));
  }

  return (
    <div className="bar">
      <span className="bar_time"><Typography variant="subtitle1">{formatDuration(props.curTime)}</Typography></span>
      <div ref={bar} className="bar_progress" style={{background: `linear-gradient(to right, ${theme.customPalette.SystemAccentColor} ${curPercentage}%, white 0)`}} onMouseDown={e => handleTimeDrag(e)}>
        <span className="bar_progress_knob" style={{left: `${curPercentage - 2}%`}}/>
      </div>
      <span className="bar_time"><Typography variant="subtitle1">{formatDuration(props.duration)}</Typography></span>
    </div>
  )
}

export default TimeBar;
