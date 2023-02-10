import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { CSSProperties, ReactNode } from "react";

export interface HelpPopupProps {
  visible: boolean,
  anchorEl?: Element,
  content?: ReactNode,
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setAnchor: React.Dispatch<React.SetStateAction<Element>>,
  setContent: React.Dispatch<React.SetStateAction<ReactNode>>,
  closePopup: () => void
}

export interface NCComponent {
  className?: string,
  style?: CSSProperties,
}

export interface NCAPIComponent extends NCComponent {

}

export interface Page extends NCComponent {

}

export interface View extends NCComponent {

}
