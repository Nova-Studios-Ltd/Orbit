import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
import type { ReactNode } from "react";
import type { Coordinates } from "./Types";

export interface HelpPopupProps {
  visible: boolean,
  anchorEl?: Element,
  content?: ReactNode,
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setAnchor: React.Dispatch<React.SetStateAction<Element>>,
  setContent: React.Dispatch<React.SetStateAction<ReactNode>>,
  closePopup: () => void
}

export interface ContextMenuProps {
  visible: boolean,
  anchorPos?: Coordinates,
  items?: ContextMenuItemProps[],
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setAnchor: React.Dispatch<React.SetStateAction<Coordinates>>,
  setItems: React.Dispatch<React.SetStateAction<ContextMenuItemProps[]>>,
  closeMenu: () => void
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
  path?: unknown,
  pageSpecificProps?: unknown
}

export interface SharedProps {
  HelpPopup?: HelpPopupProps,
  ContextMenu?: ContextMenuProps,
  widthConstrained?: boolean,
  isTouchCapable?: boolean,
  changeTitleCallback?: (title: string) => void
}
