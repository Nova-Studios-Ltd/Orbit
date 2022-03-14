import type { ReactNode } from "react";
import type { NCComponent } from "Types/Components";

export interface IPageProps extends NCComponent {
  children: ReactNode
}

function Page({ children }: IPageProps) {
  return (
    <div className="Page_Container">
      {children}
    </div>
  )
}

export default Page;
