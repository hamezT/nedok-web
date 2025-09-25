import {
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { useDevice } from "../../../../contexts/DeviceContext";
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
} from "../../../../components/ui/select";
import { fetchDeviceProfileNames } from "../../../../services/authService";
import { fetchDeviceInfos } from "../../../../services/deviceService";
import { DeviceProfile, DeviceInfo, DeviceInfoList } from "../../../../types";

// Mapping logic for device profile names to display names and descriptions
const getProfileDisplayInfo = (profileName: string) => {
  const mapping: Record<string, { displayName: string; description: string }> = {
    "GW-L0W0-00": { displayName: "Gateway", description: "GW-L0W0-00" },
    "SU-G7L0-00": { displayName: "Sensorbase", description: "SU-G7L0-00" },
    "SU-G1W0-00": { displayName: "File Uploader Device", description: "SU-G1W0-00" },
    "VT-WXCM-000": { displayName: "Camera", description: "VT-WXCM-000" },
  };

  return mapping[profileName] || { displayName: profileName, description: profileName };
};

// Calculate device counts for each profile from actual device data
const getDeviceCountForProfile = (profileName: string, deviceProfiles: DeviceProfile[], allDevices: DeviceInfo[]): number => {
  const profile = deviceProfiles.find(p => p.name === profileName);
  if (!profile) return 0;

  return allDevices.filter(device => device.deviceProfileId.id === profile.id.id).length;
};

// Calculate total device count for "All" option
const getTotalDeviceCount = (allDevices: DeviceInfo[]): number => {
  return allDevices.length;
};

// Mock data removed - now using real API data

export const DeviceListSection = (): JSX.Element => {
  const { setSelectedDevice } = useDevice();
  const [surveillanceExpanded, setSurveillanceExpanded] = useState(true);
  const [gatewayExpanded, setGatewayExpanded] = useState(true);
  const [sensorbaseExpanded, setSensorbaseExpanded] = useState(true);
  const [fileUploaderExpanded, setFileUploaderExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [deviceProfiles, setDeviceProfiles] = useState<DeviceProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [allDevices, setAllDevices] = useState<DeviceInfo[]>([]); // All devices for badge counts
  const [filteredDevices, setFilteredDevices] = useState<DeviceInfo[]>([]); // Filtered devices for display
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");

  // Fetch device profiles and all devices on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const profiles = await fetchDeviceProfileNames(false); // activeOnly=false as default
        setDeviceProfiles(profiles);

        // Load all devices for badge counts
        await loadAllDevices();
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load all devices (for badge counts)
  const loadAllDevices = async () => {
    try {
      const params: any = {
        textSearch: searchText.trim(), // Only search filter, no profile filter
      };

      const result = await fetchDeviceInfos(params);
      setAllDevices(result.data);
    } catch (error) {
      console.error('Failed to fetch all devices:', error);
      setAllDevices([]);
    }
  };

  // Filter devices based on selected profile
  const filterDevices = () => {
    if (selectedProfile === "all") {
      setFilteredDevices(allDevices);
    } else {
      const filtered = allDevices.filter(device =>
        device.deviceProfileId.id === selectedProfile
      );
      setFilteredDevices(filtered);
    }
  };

  // Effect to reload devices when filters change
  useEffect(() => {
    if (!loading) {
      loadAllDevices();
    }
  }, [searchText]);

  // Effect to filter devices when profile selection changes
  useEffect(() => {
    if (!loading) {
      filterDevices();
    }
  }, [selectedProfile, allDevices]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeviceClick = (device: DeviceInfo) => {
    if (device.additionalInfo?.gateway) {
      setSelectedDevice(device.id.id);
    }
  };

  // Group devices by device profile displayName
  const groupDevicesByProfile = () => {
    const grouped: Record<string, DeviceInfo[]> = {};

    filteredDevices.forEach(device => {
      const profile = deviceProfiles.find(p => p.id.id === device.deviceProfileId.id);
      if (profile) {
        const displayName = getProfileDisplayInfo(profile.name).displayName;
        if (!grouped[displayName]) {
          grouped[displayName] = [];
        }
        grouped[displayName].push(device);
      } else {
        // If profile not found, group under "Unknown"
        if (!grouped["Unknown"]) {
          grouped["Unknown"] = [];
        }
        grouped["Unknown"].push(device);
      }
    });

    return grouped;
  };

  const groupedDevices = groupDevicesByProfile();

  const renderDeviceItem = (device: DeviceInfo, level = 0) => {
    const paddingLeft = level === 0 ? "pl-6" : level === 1 ? "pl-12" : "pl-24";
    const hasChildren = device.additionalInfo?.gateway && false; // TODO: Implement hierarchical structure later
    const isExpanded = expandedItems[device.id.id];
    const icon = device.additionalInfo?.gateway ? "/sensor-base.svg" : "/sensor.svg";

    return (
      <div key={device.id.id} className="flex flex-col">
        <div
          className={`flex items-center gap-1.5 pr-2 py-2 ${paddingLeft} rounded-lg hover:bg-gray-50 cursor-pointer`}
          onClick={() => handleDeviceClick(device)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 w-[18px] h-[18px]"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(device.id.id);
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-[18px] h-[18px]" />
              ) : (
                <ChevronRightIcon className="w-[18px] h-[18px]" />
              )}
            </Button>
          )}
          <img className="w-5 h-5" alt={device.name} src={icon} />
          <div className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
            {device.name}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {/* TODO: Implement children rendering when API supports hierarchical data */}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex flex-col w-[280px] h-screen border-r border-[#ebebeb] bg-white">
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
            src="/arrows/arrows---arrow-left-double-line.svg"
          />
        </Button>
      </header>

      <main className="flex flex-col flex-1 px-4 py-5 gap-2 overflow-y-auto min-h-0">
        <div className="flex flex-col gap-1">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search devices..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-8 pr-4 py-1.5 border-[#ebebeb] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-400 text-sm tracking-[-0.08px]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Select
            value={selectedProfile}
            onValueChange={setSelectedProfile}
            disabled={loading}
            onOpenChange={setIsDropdownOpen}
          >
            <SelectTrigger className={`flex items-center justify-between gap-2 pl-3 pr-2.5 py-2.5 shadow-regular-shadow-x-small rounded-[10px] transition-colors ${
              isDropdownOpen
                ? 'border-[#E97132] bg-[#E97132]/5'
                : 'border-[#ebebeb] bg-white'
            }`} placeholder="All">
              <div className="flex items-center gap-2 flex-1">
                <FilterIcon className={`w-5 h-5 transition-colors ${
                  isDropdownOpen ? 'text-[#E97132]' : 'text-gray-500'
                }`} />
                <div className="flex flex-col items-start flex-1">
                  <span className={`font-paragraph-small transition-colors ${
                    isDropdownOpen ? 'text-[#E97132]' : 'text-[#5c5c5c]'
                  }`}>
                    {loading ? "Loading..." : selectedProfile === "all" ? "All" : getProfileDisplayInfo(
                      deviceProfiles.find(p => p.id.id === selectedProfile)?.name || ""
                    ).displayName}
                  </span>
                </div>
              </div>
              <div className={`flex items-center justify-center w-8 h-6 rounded-full text-xs font-semibold transition-colors ${
                isDropdownOpen
                  ? 'bg-[#E97132] text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {loading ? "..." : selectedProfile === "all" ? getTotalDeviceCount(allDevices) : getDeviceCountForProfile(
                  deviceProfiles.find(p => p.id.id === selectedProfile)?.name || "",
                  deviceProfiles,
                  allDevices
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="all"
                className="font-paragraph-small text-[#5c5c5c] flex flex-col px-3 py-2 items-start"
              >
                <div className="relative w-full pr-12">
                  <span>All</span>
                  <span className="absolute right-6 top-0 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                    {getTotalDeviceCount(allDevices)}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-1">Show all device types</span>
              </SelectItem>
              {deviceProfiles
                .filter((profile) => profile.name.toLowerCase() !== 'default')
                .map((profile) => {
                const info = getProfileDisplayInfo(profile.name);
                const count = getDeviceCountForProfile(profile.name, deviceProfiles, allDevices);
                return (
                  <SelectItem
                    key={profile.id.id}
                    value={profile.id.id}
                    className="font-paragraph-small text-[#5c5c5c] flex flex-col px-3 py-2 items-start"
                  >
                    <div className="relative w-full pr-12">
                      <span>{info.displayName}</span>
                      <span className="absolute right-6 top-0 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                        {count}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Description</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-0">
          {Object.entries(groupedDevices).map(([groupName, deviceList]) => {
            const isGroupExpanded = groupName === "Camera" ? surveillanceExpanded :
                                   groupName === "Gateway" ? gatewayExpanded :
                                   groupName === "Sensorbase" ? sensorbaseExpanded :
                                   groupName === "File Uploader Device" ? fileUploaderExpanded : true;

            return (
              <Collapsible
                key={groupName}
                open={isGroupExpanded}
                onOpenChange={(open) => {
                  if (groupName === "Camera") setSurveillanceExpanded(open);
                  else if (groupName === "Gateway") setGatewayExpanded(open);
                  else if (groupName === "Sensorbase") setSensorbaseExpanded(open);
                  else if (groupName === "File Uploader Device") setFileUploaderExpanded(open);
                }}
              >
                <CollapsibleTrigger className="flex items-center gap-1 pt-2 pb-3 px-0 w-full hover:bg-gray-50 rounded">
                  <ChevronDownIcon
                    className={`w-[18px] h-[18px] transition-transform ${
                      isGroupExpanded ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="flex-1 text-left [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                    {groupName}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    {deviceList.length > 0 ? (
                      deviceList.map((device) => renderDeviceItem(device))
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-4">
                        No devices found for this profile.
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
          {Object.keys(groupedDevices).length === 0 && (
            <div className="text-center text-gray-500 text-sm py-4">
              {loading ? "Loading devices..." : filteredDevices.length === 0 && allDevices.length > 0 ? "No devices found for selected profile." : "No devices found."}
              <br />
              <span className="text-xs">Try adjusting your search or filter criteria.</span>
            </div>
          )}
        </div>
      </main>
    </aside>
  );
};