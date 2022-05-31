import { Fragment } from "react";

export enum IndicatorState {
  Positive,
  Intermedate,
  Negative
}

interface PropThings {
  state: IndicatorState
}

const StatusIndicator = ({state}: PropThings) => {

  const styles = { backgroundColor: "#25956b" };
  if (state === IndicatorState.Positive) styles.backgroundColor = "#25956b";
  if (state === IndicatorState.Intermedate) styles.backgroundColor = "#cc8800";
  else styles.backgroundColor = "#9e0000";

  return state ? (
    <Fragment>
      <span className="colored-circle" style={styles} />
    </Fragment>
  ) : null;
};

export default StatusIndicator;
