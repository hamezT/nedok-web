import { createContext, useContext, useState, ReactNode } from "react";

interface DeviceContextType {
  selectedDevice: string | null;
  setSelectedDevice: (device: string | null) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <DeviceContext.Provider value={{ selectedDevice, setSelectedDevice }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
}
