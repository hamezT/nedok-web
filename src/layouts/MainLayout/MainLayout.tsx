import { ReactNode, memo } from "react";
import { Menu } from "lucide-react";
import { Header } from "./Header";
import { Button } from "../../components/ui/button";
import { MobileProvider, useMobile } from "../../contexts/MobileContext";
interface MainLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

// Memoize các component để tránh re-render không cần thiết
const MemoizedHeader = memo(Header);

const MainLayoutContent = ({ children, sidebar }: MainLayoutProps): JSX.Element => {
  const { isSidebarOpen, isSidebarCollapsed, toggleSidebar } = useMobile();

  return (
    <div className="flex flex-col w-full min-h-screen items-start relative bg-[#f3f8ee]">
      <MemoizedHeader />
      <main className="flex items-start relative flex-1 w-full grow">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-3 left-3 z-50 bg-white rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Overlay for mobile */}
        <div
          className={`fixed inset-0 bg-black/50 lg:hidden transition-opacity ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        />

        {/* Sidebar with DeviceList */}
        <div
          className={`fixed lg:static inset-y-0 left-0 bg-white transform transition-all duration-300 lg:transform-none z-40 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 ${
            isSidebarCollapsed ? "lg:w-[80px]" : "lg:w-[280px]"
          }`}
        >
          {sidebar}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full lg:w-auto min-h-screen p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export const MainLayout = memo((props: MainLayoutProps): JSX.Element => {
  return (
    <MobileProvider>
      <MainLayoutContent {...props} />
    </MobileProvider>
  );
});