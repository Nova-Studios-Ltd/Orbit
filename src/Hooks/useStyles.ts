import { CSSProperties } from "react";

function useStyles(initialStyles: CSSProperties, overriddenStyles?: CSSProperties) {
  return Object.assign(initialStyles, overriddenStyles);
}

export default useStyles;
