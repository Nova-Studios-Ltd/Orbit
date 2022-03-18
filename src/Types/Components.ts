import type { ReactNode } from "react"

export interface NCComponent {

}

export interface Page {
  changeTitleCallback?: (title: string) => void
  widthConstrained?: boolean
}

export interface View {
  page?: ReactNode
}
