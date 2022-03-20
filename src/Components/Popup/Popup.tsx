import React from "react";
import "./Popup.css";

export interface IPopup {
  triggered?: boolean
}

export class Popup extends React.Component<IPopup> {

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
