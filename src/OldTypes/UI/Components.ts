import type { IRawChannelProps } from "OldTypes/API/Interfaces/IRawChannelProps";
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
  sharedProps?: SharedProps
}

export interface NCAPIComponent extends NCComponent {
  selectedChannel?: IRawChannelProps,
}

export interface Page extends NCComponent {

}

export interface View extends NCComponent {

}

export interface SharedProps {
  HelpPopup?: HelpPopupProps,
  widthConstrained?: boolean,
  isTouchCapable?: boolean,
  openConsole?: () => void,
  title?: string,
  changeTitleCallback?: (title: string) => void
}
