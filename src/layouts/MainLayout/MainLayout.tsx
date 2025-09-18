import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export const MainLayout = ({ sidebar, children }: MainLayoutProps): JSX.Element => {
  return (
    <div className="flex flex-col w-full min-h-screen items-start relative bg-[#f3f8ee]">
      <Header />
      <main className="flex items-start relative flex-1 w-full grow">
        <Sidebar>
          {sidebar}
        </Sidebar>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
