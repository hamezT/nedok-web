import { MainLayout } from "../../layouts/MainLayout/MainLayout";
import { DeviceListSection } from "./sections/DeviceListSection/DeviceListSection";
import { GatewayListSection } from "./sections/GatewayListSection/GatewayListSection";
import { SensorDataSection } from "./sections/SensorDataSection/SensorDataSection";
import { SidebarProvider } from "../../contexts/SidebarContext";
import { DeviceProvider, useDevice } from "../../contexts/DeviceContext";

const HomeContent = (): JSX.Element => {
  const { selectedDevice } = useDevice();
  
  console.log("Current selectedDevice:", selectedDevice); // Debug log

  return (
    <MainLayout sidebar={<DeviceListSection />}>
      {selectedDevice ? <SensorDataSection /> : <GatewayListSection />}
    </MainLayout>
  );
};

export const Home = (): JSX.Element => {
  return (
    <SidebarProvider>
      <DeviceProvider>
        <HomeContent />
      </DeviceProvider>
    </SidebarProvider>
  );
};