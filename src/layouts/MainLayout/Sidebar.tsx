import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

export const Sidebar = ({ children }: SidebarProps): JSX.Element => {
  return (
    <aside className="flex-shrink-0 w-[280px] bg-white border-r border-solid border-[#ebebeb]">
      {children}
    </aside>
  );
};
