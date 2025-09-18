import {
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible";
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

const gatewayDevices = [
  {
    id: "gateway0",
    name: "Gateway 0",
    icon: "/sensor-base.svg",
    expanded: true,
    children: [
      {
        id: "sensor1",
        name: "1CA7B9AB6224224_1",
        icon: "/sensor.svg",
        expanded: true,
        children: [
          {
            id: "cam4",
            name: "CAM-36(USB-ADATA)",
            icon: "/camera-connected.svg",
          },
          {
            id: "cam5",
            name: "CAM-36(USB-ADATA)",
            icon: "/camera-connected.svg",
          },
        ],
      },
      {
        id: "sensor2",
        name: "1CA7B9AB6224224_1",
        icon: "/sensor.svg",
        expanded: false,
      },
      {
        id: "sensor3",
        name: "1CA7BBBB6224224_1",
        icon: "/sensor.svg",
        expanded: false,
      },
    ],
  },
  {
    id: "gateway1",
    name: "Gateway 1",
    icon: "/sensor-base.svg",
    expanded: false,
  },
  {
    id: "gateway2",
    name: "Gateway 2",
    icon: "/sensor-base.svg",
    expanded: false,
  },
  {
    id: "gateway3",
    name: "GW2501000_Test_Customer",
    icon: "/sensor-base.svg",
    expanded: false,
  },
  {
    id: "gateway4",
    name: "GW3501991",
    icon: "/sensor-base.svg",
    expanded: false,
  },
];

export const DeviceListSection = (): JSX.Element => {
  const [surveillanceExpanded, setSurveillanceExpanded] = useState(true);
  const [gatewayExpanded, setGatewayExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    gateway0: true,
    sensor1: true,
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderDeviceItem = (device: any, level = 0) => {
    const paddingLeft = level === 0 ? "pl-6" : level === 1 ? "pl-12" : "pl-24";
    const hasChildren = device.children && device.children.length > 0;
    const isExpanded = expandedItems[device.id];

    return (
      <div key={device.id} className="flex flex-col">
        <div
          className={`flex items-center gap-1.5 pr-2 py-2 ${paddingLeft} rounded-lg hover:bg-gray-50 cursor-pointer`}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 w-[18px] h-[18px]"
              onClick={() => toggleExpanded(device.id)}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-[18px] h-[18px]" />
              ) : (
                <ChevronRightIcon className="w-[18px] h-[18px]" />
              )}
            </Button>
          )}
          <img className="w-5 h-5" alt={device.name} src={device.icon} />
          <div className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
            {device.name}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {device.children.map((child: any) =>
              renderDeviceItem(child, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex flex-col w-[280px] h-[960px] border-r border-[#ebebeb] bg-white">
      <header className="flex items-center gap-4 px-4 py-5 h-[52px] border-b border-[#ebebeb]">
        <h1 className="flex-1 [font-family:'SF_Pro_Display-Bold',Helvetica] font-bold text-neutral-900 text-base leading-7">
          Devices
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto w-9 h-9 p-1.5 bg-[#e971321a] rounded-lg hover:bg-[#e971322a]"
        >
          <img
            className="w-5 h-5"
            alt="Collapse"
            src="/arrows---arrow-left-double-line.svg"
          />
        </Button>
      </header>

      <main className="flex flex-col flex-1 px-4 py-5 gap-2 overflow-y-auto">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="SearchIcon..."
              className="pl-8 pr-4 py-1.5 border-[#ebebeb] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-400 text-sm tracking-[-0.08px]"
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

        <div className="flex flex-col gap-0">
          <Collapsible
            open={surveillanceExpanded}
            onOpenChange={setSurveillanceExpanded}
          >
            <CollapsibleTrigger className="flex items-center gap-1 pt-2 pb-3 px-0 w-full hover:bg-gray-50 rounded">
              <ChevronDownIcon
                className={`w-[18px] h-[18px] transition-transform ${surveillanceExpanded ? "" : "-rotate-90"}`}
              />
              <span className="flex-1 text-left [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                Surveilliance CameraIcon
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                {surveillanceCameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-center gap-1.5 pl-6 pr-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <img className="w-5 h-5" alt="Camera" src={camera.icon} />
                    <div className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      {camera.name}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={gatewayExpanded} onOpenChange={setGatewayExpanded}>
            <CollapsibleTrigger className="flex items-center gap-1 pt-2 pb-3 px-0 w-full hover:bg-gray-50 rounded">
              <ChevronDownIcon
                className={`w-[18px] h-[18px] transition-transform ${gatewayExpanded ? "" : "-rotate-90"}`}
              />
              <span className="flex-1 text-left [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                Gateway
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col">
                {gatewayDevices.map((gateway) => renderDeviceItem(gateway))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
    </aside>
  );
};
