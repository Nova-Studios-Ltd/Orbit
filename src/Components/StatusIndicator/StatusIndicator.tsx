import { useTheme } from "@mui/material";

export enum IndicatorState {
  Positive,
  Intermediate,
  Negative
}

interface StatusIndicatorProps {
  children?: JSX.Element[] | string[] | JSX.Element | string | (string | JSX.Element)[],
  state: IndicatorState
}

function StatusIndicator(props: StatusIndicatorProps) {
  const theme = useTheme();

  const styles = { backgroundColor: "#25956b" };
  if (props.state === IndicatorState.Positive) styles.backgroundColor = "#25956b";
  if (props.state === IndicatorState.Intermediate) styles.backgroundColor = "#cc8800";
  if (props.state === IndicatorState.Negative) styles.backgroundColor = "#9e0000";

  return (
    <div className="StatusIndicatorContainer" style={{ fontFamily: theme.typography.body1.fontFamily }}>
      <span className="ColoredCircle" style={styles}/>
      <div className="StatusIndicatorItemContainer">
        {props.children}
      </div>
    </div>
  );
};

export default StatusIndicator;
