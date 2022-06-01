import { Fragment } from "react";

export enum IndicatorState {
  Positive,
  Intermedate,
  Negative
}

interface PropThings {
  children?: JSX.Element[] | string[] | JSX.Element | string | (string | JSX.Element)[],
  state: IndicatorState
}

const StatusIndicator = (props: PropThings) => {

  const styles = { backgroundColor: "#25956b" };
  if (props.state === IndicatorState.Positive) styles.backgroundColor = "#25956b";
  if (props.state === IndicatorState.Intermedate) styles.backgroundColor = "#cc8800";
  if (props.state === IndicatorState.Negative) styles.backgroundColor = "#9e0000";

  return (
    <Fragment>
      <span className="colored-circle" style={styles}/>
      {props.children}
    </Fragment>
  );
};

export default StatusIndicator;
