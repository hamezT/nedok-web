import { MainLayout } from "../../layouts/MainLayout/MainLayout";
import { DeviceListSection } from "./sections/DeviceListSection/DeviceListSection";
import { GatewayListSection } from "./sections/GatewayListSection/GatewayListSection";
import { SidebarProvider } from "../../contexts/SidebarContext";

export const Home = (): JSX.Element => {
  return (
    <SidebarProvider>
      <MainLayout
        sidebar={<DeviceListSection />}
      >
        <GatewayListSection />
      </MainLayout>
    </SidebarProvider>
  );
};
