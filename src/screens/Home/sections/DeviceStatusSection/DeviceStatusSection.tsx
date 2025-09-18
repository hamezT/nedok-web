import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const surveillanceCameras = [
  { id: "cam1", name: "CAM-36(USB-ADATA)", icon: "/camera-connected.svg" },
  { id: "cam2", name: "VT25020X1", icon: "/camera-connected.svg" },
  { id: "cam3", name: "VT25020XX", icon: "/camera-connected.svg" },
];

const gateway0Sensors = [
  {
    id: "sensor1",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: true,
    cameras: [
      { id: "cam4", name: "CAM-36(USB-ADATA)", icon: "/camera-connected.svg" },
      { id: "cam5", name: "CAM-36(USB-ADATA)", icon: "/camera-connected.svg" },
    ],
  },
  {
    id: "sensor2",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor3",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor4",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor5",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor6",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor7",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
  {
    id: "sensor8",
    name: "SBYYMMDDXXX",
    icon: "/sensor.svg",
    expanded: false,
    cameras: [],
  },
];

const otherGateways = [
  { id: "gw1", name: "Gateway 1", icon: "/sensor-base.svg", expanded: false },
  { id: "gw2", name: "Gateway 2", icon: "/sensor-base.svg", expanded: false },
  {
    id: "gw3",
    name: "GW2501000_Test_Customer",
    icon: "/sensor-base.svg",
    expanded: false,
  },
  { id: "gw4", name: "GW3501991", icon: "/sensor-base.svg", expanded: false },
];

export const DeviceStatusSection = (): JSX.Element => {
  const [surveillanceCameraExpanded, setSurveillanceCameraExpanded] =
    useState(false);
  const [gateway0Expanded, setGateway0Expanded] = useState(true);
  const [sensorStates, setSensorStates] = useState<Record<string, boolean>>({
    sensor1: true,
  });

  const toggleSensor = (sensorId: string) => {
    setSensorStates((prev) => ({
      ...prev,
      [sensorId]: !prev[sensorId],
    }));
  };

  return (
    <aside className="flex flex-col w-[280px] h-[960px] bg-white border-r border-[#ebebeb]">
      <header className="flex items-center justify-between gap-4 px-4 py-5 h-[52px] border-b border-[#ebebeb]">
        <h1 className="[font-family:'SF_Pro_Display-Bold',Helvetica] font-bold text-neutral-900 text-base leading-7">
          Devices
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="w-9 h-9 p-1.5 bg-[#e971321a] hover:bg-[#e971321a] rounded-lg"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
      </header>

      <main className="flex flex-col flex-1 px-4 py-5 gap-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="SearchIcon..."
              className="pl-9 pr-3 py-1.5 text-sm text-neutral-400 [font-family:'SF_Pro_Text-Regular',Helvetica] tracking-[-0.08px] border-[#ebebeb]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Select defaultValue="all">
            <SelectTrigger className="flex items-center gap-2 pl-3 pr-2.5 py-2.5 border-[#ebebeb] shadow-regular-shadow-x-small rounded-[10px]">
              <FilterIcon className="w-5 h-5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="font-paragraph-small text-[#5c5c5c]"
              >
                All
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <nav className="flex flex-col">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() =>
                setSurveillanceCameraExpanded(!surveillanceCameraExpanded)
              }
              className="flex items-center gap-1 pt-2 pb-3 px-0 h-auto justify-start hover:bg-transparent"
            >
              {surveillanceCameraExpanded ? (
                <ChevronDownIcon className="w-[18px] h-[18px]" />
              ) : (
                <ChevronRightIcon className="w-[18px] h-[18px]" />
              )}
              <span className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                Surveilliance Camera
              </span>
            </Button>

            {surveillanceCameraExpanded && (
              <div className="flex flex-col gap-2 ml-6">
                {surveillanceCameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-center gap-1.5 px-2 py-2 rounded-lg"
                  >
                    <img
                      src={camera.icon}
                      alt="Camera connected"
                      className="w-5 h-5"
                    />
                    <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      {camera.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="ghost"
              onClick={() => setGateway0Expanded(!gateway0Expanded)}
              className="flex items-center gap-1.5 pl-6 pr-2 py-2 h-auto justify-start bg-[#e971321a] hover:bg-[#e971321a] rounded-lg"
            >
              {gateway0Expanded ? (
                <ChevronDownIcon className="w-[18px] h-[18px]" />
              ) : (
                <ChevronRightIcon className="w-[18px] h-[18px]" />
              )}
              <img
                src="/sensor-base.svg"
                alt="Sensor base"
                className="w-5 h-5"
              />
              <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                Gateway 0
              </span>
            </Button>

            {gateway0Expanded && (
              <div className="flex flex-col gap-2">
                {gateway0Sensors.map((sensor) => (
                  <div key={sensor.id} className="flex flex-col">
                    <Button
                      variant="ghost"
                      onClick={() => toggleSensor(sensor.id)}
                      className="flex items-center gap-1.5 pl-12 pr-2 py-2 h-auto justify-start bg-[#f7f7f7] hover:bg-[#f7f7f7] rounded-lg"
                    >
                      {sensorStates[sensor.id] ? (
                        <ChevronDownIcon className="w-[18px] h-[18px]" />
                      ) : (
                        <ChevronRightIcon className="w-[18px] h-[18px]" />
                      )}
                      <img src={sensor.icon} alt="Sensor" className="w-5 h-5" />
                      <span className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        {sensor.name}
                      </span>
                    </Button>

                    {sensorStates[sensor.id] && sensor.cameras.length > 0 && (
                      <div className="flex flex-col gap-2 ml-6">
                        {sensor.cameras.map((camera) => (
                          <div
                            key={camera.id}
                            className="flex items-center gap-1.5 pl-24 pr-2 py-2 bg-[#f7f7f7] rounded-lg"
                          >
                            <img
                              src={camera.icon}
                              alt="Camera connected"
                              className="w-5 h-5"
                            />
                            <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                              {camera.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {otherGateways.map((gateway) => (
              <Button
                key={gateway.id}
                variant="ghost"
                className="flex items-center gap-1.5 pl-6 pr-2 py-2 h-auto justify-start hover:bg-transparent rounded-lg"
              >
                <ChevronRightIcon className="w-[18px] h-[18px]" />
                <img src={gateway.icon} alt="Sensor base" className="w-5 h-5" />
                <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                  {gateway.name}
                </span>
              </Button>
            ))}
          </div>
        </nav>
      </main>
    </aside>
  );
};
