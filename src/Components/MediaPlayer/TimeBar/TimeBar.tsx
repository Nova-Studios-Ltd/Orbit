import { useTheme } from "@mui/material";
import moment, { duration } from "moment";
import { useRef } from "react";

export interface TimeBarProps {
  duration: number,
  curTime: number,
  onTimeUpdate: (seconds: number) => void
}

function TimeBar(props: TimeBarProps) {
  const theme = useTheme();
  const bar = useRef<HTMLDivElement>(null);

  const curPercentage = (props.curTime / props.duration) * 100;

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
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    props.onTimeUpdate(calcClickedTime(e));
  }

  return (
    <div className="bar">
      <span className="bar_time">{formatDuration(props.curTime)}</span>
      <div ref={bar} className="bar_progress" style={{background: `linear-gradient(to right, orange ${curPercentage}%, white 0)`}} onMouseDown={e => handleTimeDrag(e)}>
        <span className="bar_progress_knob" style={{left: `${curPercentage - 2}%`}}/>
      </div>
    </div>
  )
}

export default TimeBar;
