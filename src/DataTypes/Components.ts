import type { IRawChannelProps } from "Interfaces/IRawChannelProps";
import type { ContextMenuItemProps } from "Components/Menus/ContextMenuItem/ContextMenuItem";
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

export interface ContextMenuProps {
  visible: boolean,
  anchorEl?: Element,
  items?: ContextMenuItemProps[],
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setAnchor: React.Dispatch<React.SetStateAction<Element>>,
  setItems: React.Dispatch<React.SetStateAction<ContextMenuItemProps[]>>,
  closeMenu: () => void
}

export interface NCComponent {
  className?: string,
  HelpPopup?: HelpPopupProps,
  ContextMenu?: ContextMenuProps
}

export interface NCAPIComponent extends NCComponent {
  selectedChannel?: IRawChannelProps,
}

export interface Page {
  HelpPopup?: HelpPopupProps,
  ContextMenu?: ContextMenuProps,
  widthConstrained?: boolean,
  changeTitleCallback?: (title: string) => void
}

export interface View {
  path?: unknown,
  HelpPopup?: HelpPopupProps,
  ContextMenu?: ContextMenuProps,
  widthConstrained?: boolean,
  pageSpecificProps?: unknown,
  changeTitleCallback?: (title: string) => void
}
