import type { CSSProperties } from "react";

export interface NCComponent {
  className?: string,
  style?: CSSProperties,
  renderCondition?: boolean
}

export interface NCAPIComponent extends NCComponent {

}

export interface Page extends NCComponent {

}

export interface View extends NCComponent {

}
