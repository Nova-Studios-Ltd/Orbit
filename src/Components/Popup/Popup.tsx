import React, { ReactNode } from "react";
import "./Popup.css";

export interface IPopupProps {
  children: ReactNode,
  triggered?: boolean
}

export class Popup extends React.Component<IPopupProps> {

  render() {
    return (this.props.triggered) ? (
      <div className="popup">
        <div className="popup-inner">
          Click anywhere to close
          <br></br>
          {this.props.children}
        </div>
      </div>) : ("");
  }
}
