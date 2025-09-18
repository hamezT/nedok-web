import { ReactNode, createContext, useContext, useState } from "react";

interface SidebarContextType {
  selectedItem: string | null;
  setSelectedItem: (item: string | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <SidebarContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SidebarContext.Provider>
  );
};
