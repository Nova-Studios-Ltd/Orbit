import type { IRawChannelProps } from "Types/API/Interfaces/IRawChannelProps";
import type { ReactNode } from "react";

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
  sharedProps?: SharedProps,
  className?: string,
}

export interface NCAPIComponent extends NCComponent {
  selectedChannel?: IRawChannelProps,
}

export interface Page {
  sharedProps?: SharedProps,
  className?: string,
}

export interface View {
  sharedProps?: SharedProps,
  className?: string,
  pageSpecificProps?: unknown
}

export interface SharedProps {
  HelpPopup?: HelpPopupProps,
  widthConstrained?: boolean,
  isTouchCapable?: boolean,
  openConsole?: () => void,
  changeTitleCallback?: (title: string) => void
}
