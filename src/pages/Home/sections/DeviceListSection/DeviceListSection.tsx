import {
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
  Upload,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "../../../../components/ui/button";

import { Tooltip } from "../../../../components/ui/tooltip";
import { useDevice } from "../../../../contexts/DeviceContext";
import { useMobile } from "../../../../contexts/MobileContext";
import { Input } from "../../../../components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../../../components/ui/select";
import { fetchDeviceProfileNames } from "../../../../services/authService";
import { fetchDeviceInfos } from "../../../../services/deviceService";
import { fetchAllRelationsForDevices } from "../../../../services/relationService";
import { DeviceProfile, DeviceInfo } from "../../../../types";
import { DeviceRelation } from "../../../../types/api/relation";

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

export const DeviceListSection = (): JSX.Element => {
  const { setSelectedDevice } = useDevice();
  const { isSidebarCollapsed, toggleSidebarCollapsed } = useMobile();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [deviceProfiles, setDeviceProfiles] = useState<DeviceProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("all");
  const [allDevices, setAllDevices] = useState<DeviceInfo[]>([]);
  const [allRelations, setAllRelations] = useState<DeviceRelation[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Gateway: true,
    Sensorbase: true,
    Camera: true,
    "File Uploader Device": true,
  });

  const profileIdToNameMap = useMemo(() => {
    const newMap = new Map<string, string>();
    deviceProfiles.forEach(p => newMap.set(p.id.id, p.name));
    return newMap;
  }, [deviceProfiles]);

  // Custom hook for debouncing search text
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Debounce search text with 500ms delay
  const debouncedSearch = useDebounce(searchText, 500);

  // Update debounced search text when debounced value changes
  useEffect(() => {
    setDebouncedSearchText(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    let isCancelled = false;

    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load profiles first
        const profiles = await fetchDeviceProfileNames(false);
        if (isCancelled) return;
        setDeviceProfiles(profiles);

        // Load devices with search
        const params = { textSearch: debouncedSearchText.trim() };
        const result = await fetchDeviceInfos(params);
        if (isCancelled) return;
        setAllDevices(result.data);

        // Load relations for all devices
        if (result.data.length > 0) {
          const deviceIds = result.data.map(device => device.id.id);
          const relations = await fetchAllRelationsForDevices(deviceIds);
          if (isCancelled) return;
          setAllRelations(relations);
        } else {
          setAllRelations([]);
        }

      } catch (err) {
        if (!isCancelled) {
          setError('Failed to load device data. Please try again later.');
          setAllDevices([]);
          setAllRelations([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadAllData();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchText]);

  useEffect(() => {
    let devices = allDevices;

    // Apply profile filter first
    if (selectedProfile !== "all") {
      devices = devices.filter(device => device.deviceProfileId.id === selectedProfile);
    }

    // Apply search filter
    if (debouncedSearchText.trim() !== "") {
      const searchLower = debouncedSearchText.toLowerCase().trim();
      devices = devices.filter(device =>
        device.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDevices(devices);
  }, [selectedProfile, allDevices, debouncedSearchText]);


  // Tối ưu: Memoize các hàm helper để tránh tạo lại mỗi lần
  const isRootDevice = useCallback((deviceId: string, parentMap: Map<string, string>, childrenMap: Map<string, string[]>) => {
    return !parentMap.has(deviceId) && childrenMap.has(deviceId);
  }, []);

  const isStandaloneDevice = useCallback((deviceId: string, parentMap: Map<string, string>, childrenMap: Map<string, string[]>) => {
    return !parentMap.has(deviceId) && !childrenMap.has(deviceId);
  }, []);

  const { groupedDevices, childrenMap, deviceMap, parentMap } = useMemo(() => {
    const deviceMap = new Map<string, DeviceInfo>();
    allDevices.forEach(device => deviceMap.set(device.id.id, device));

    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string>();

    // Xây dựng maps từ relations - tối ưu bằng cách sử dụng Map thay vì lặp nhiều lần
    allRelations.forEach(relation => {
      const parentId = relation.from.id;
      const childId = relation.to.id;

      if (deviceMap.has(childId) && deviceMap.has(parentId)) {
        parentMap.set(childId, parentId);

        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, []);
        }
        if (!childrenMap.get(parentId)!.includes(childId)) {
          childrenMap.get(parentId)!.push(childId);
        }
      }
    });

    const grouped: Record<string, DeviceInfo[]> = {};
    const processedDevices = new Set<string>();

    // Xử lý grouping - tối ưu bằng cách group theo profile trước
    filteredDevices.forEach(device => {
      const deviceId = device.id.id;

      if (processedDevices.has(deviceId)) return;

      const profileName = profileIdToNameMap.get(device.deviceProfileId.id) || "Unknown";
      const groupInfo = getProfileDisplayInfo(profileName);
      const groupName = groupInfo.displayName;

      // Kiểm tra loại thiết bị
      const deviceIsRoot = isRootDevice(deviceId, parentMap, childrenMap);
      const deviceIsStandalone = isStandaloneDevice(deviceId, parentMap, childrenMap);

      if (deviceIsRoot || deviceIsStandalone) {
        if (!grouped[groupName]) grouped[groupName] = [];
        grouped[groupName].push(device);
        processedDevices.add(deviceId);

        // Đánh dấu children đã xử lý - tối ưu bằng cách chỉ lặp một lần
        const markChildrenAsProcessed = (parentId: string) => {
          const children = childrenMap.get(parentId);
          if (children) {
            children.forEach(childId => {
              processedDevices.add(childId);
            });
          }
        };
        markChildrenAsProcessed(deviceId);
      }
    });

    return { groupedDevices: grouped, childrenMap, deviceMap, parentMap };
  }, [filteredDevices, allRelations, allDevices, profileIdToNameMap, isRootDevice, isStandaloneDevice]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleDeviceClick = useCallback((device: DeviceInfo) => {
    setSelectedDevice(device.id.id);
  }, [setSelectedDevice]);

  const getDeviceChildren = useCallback((deviceId: string): DeviceInfo[] => {
    const childIds = childrenMap.get(deviceId) || [];
    return childIds.map(id => deviceMap.get(id)).filter(Boolean) as DeviceInfo[];
  }, [childrenMap, deviceMap]);

  const getParentDevice = useCallback((deviceId: string): DeviceInfo | null => {
    const parentId = parentMap.get(deviceId);
    return parentId ? deviceMap.get(parentId) || null : null;
  }, [parentMap, deviceMap]);

  const toggleGroupExpanded = useCallback((groupName: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  }, []);
  
  const renderDeviceItem = useCallback((device: DeviceInfo, level = 0) => {
    const hasChildren = (childrenMap.get(device.id.id) || []).length > 0;
    const isExpanded = expandedItems[device.id.id];
    const profileName = profileIdToNameMap.get(device.deviceProfileId.id);

    // Tìm thiết bị cha (nếu có) - tối ưu bằng cách sử dụng parentMap
    const parentDevice = getParentDevice(device.id.id);
    const parentProfileName = parentDevice ? profileIdToNameMap.get(parentDevice.deviceProfileId.id) : null;

    // Kiểm tra xem thiết bị có phải là con của thiết bị khác không
    const isChildDevice = parentDevice !== null;
    
    // Kiểm tra các mối quan hệ đặc biệt
    const isCameraChildOfSensorbase = profileName === "VT-WXCM-000" && parentProfileName === "SU-G7L0-00";

    // Thiết bị độc lập là thiết bị không có con và không phải là con của thiết bị khác
    const isStandaloneDevice = !hasChildren && !isChildDevice;

    const icon =
      profileName === "VT-WXCM-000"
        ? "/icons/camera-connected.svg"
        : device.additionalInfo?.gateway
        ? "/sensor-base.svg"
        : "/sensor.svg";

    // Tính toán padding dựa trên cấp độ, loại thiết bị và trạng thái
    let basePadding;
    
    if (isStandaloneDevice) {
      // Thiết bị độc lập
      basePadding = 12;
    } else if (isCameraChildOfSensorbase) {
      // Camera là con của sensorbase - đảm bảo nó có padding cố định 60px
      basePadding = 60;
    } else {
      // Các thiết bị khác - tính padding dựa trên cấp độ
      basePadding = level * 20 + 12;
    }

    return (
      <div key={device.id.id} className="flex flex-col">
        <div
          className={`flex items-center px-3 py-2 mx-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 text-gray-700`}
          style={{ paddingLeft: `${basePadding}px` }}
          onClick={() => handleDeviceClick(device)}
        >
          {hasChildren && (
            <button
              className="mr-1 p-0.5 rounded hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(device.id.id);
              }}
            >
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
          
          <div className="mr-2">
            <img className="w-5 h-5 flex-shrink-0" alt={device.name} src={icon} />
          </div>
          
          <Tooltip content={device.name} position="top">
            <span className="flex-1 text-sm font-normal truncate">
              {device.name}
            </span>
          </Tooltip>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">
            {getDeviceChildren(device.id.id).map(child => renderDeviceItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  }, [childrenMap, expandedItems, profileIdToNameMap, getParentDevice, getDeviceChildren, handleDeviceClick, toggleExpanded]);
  
  const getDeviceCountForProfile = (profileId: string): number => {
    if (profileId === 'all') return allDevices.length;
    return allDevices.filter(device => device.deviceProfileId.id === profileId).length;
  };

  return (
    <aside className={`flex flex-col h-screen border-r border-[#ebebeb] bg-white transition-all duration-300 ${
      isSidebarCollapsed ? 'w-[80px]' : 'w-[280px]'
    }`}>
      <header className="flex items-center justify-center px-4 py-5 h-[52px] border-b border-[#ebebeb]">
        {isSidebarCollapsed ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto w-9 h-9 p-1.5 bg-[#e971321a] rounded-lg hover:bg-[#e971322a]"
            onClick={toggleSidebarCollapsed}
            title="Expand sidebar"
          >
            <div className="w-5 h-5 flex items-center justify-center text-gray font-bold">→</div>
          </Button>
        ) : (
          <>
            <h1 className="flex-1 [font-family:'SF_Pro_Display-Bold',Helvetica] font-bold text-neutral-900 text-base leading-7">
              Devices
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto w-9 h-9 p-1.5 bg-[#e971321a] rounded-lg hover:bg-[#e971322a]"
              onClick={toggleSidebarCollapsed}
              title="Collapse sidebar"
            >
              <img
                className="w-5 h-5"
                alt="Collapse"
                src="/arrows/arrows---arrow-left-double-line.svg"
              />
            </Button>
          </>
        )}
      </header>

      <main className={`flex flex-col flex-1 overflow-y-auto overflow-x-auto min-h-0 min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'px-2 py-3' : 'px-4 py-5 gap-2'
      }`}>
        {!isSidebarCollapsed && (
          <>
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
                  isDropdownOpen ? 'border-[#E97132] bg-[#E97132]/5' : 'border-[#ebebeb] bg-white'
                }`} placeholder="All">
                  <div className="flex items-center gap-2 flex-1">
                    <FilterIcon className={`w-5 h-5 transition-colors ${isDropdownOpen ? 'text-[#E97132]' : 'text-gray-500'}`} />
                    <div className="flex flex-col items-start flex-1">
                      <span className={`font-paragraph-small transition-colors ${isDropdownOpen ? 'text-[#E97132]' : 'text-[#5c5c5c]'}`}>
                        {loading ? "Loading..." : selectedProfile === "all" ? "All" : getProfileDisplayInfo(profileIdToNameMap.get(selectedProfile) || "").displayName}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center justify-center w-8 h-6 rounded-full text-xs font-semibold transition-colors ${
                    isDropdownOpen ? 'bg-[#E97132] text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {loading ? "..." : getDeviceCountForProfile(selectedProfile)}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="all"
                    className="font-paragraph-small text-[#5c5c5c] relative flex flex-col p-0 items-start"
                    style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    <style dangerouslySetInnerHTML={{
                      __html: `
                        [data-radix-select-item][data-state="checked"] [data-radix-select-item-indicator] {
                          display: none !important;
                        }
                      `
                    }} />
                    <div className="flex items-center w-full">
                      <span>All</span>
                      <span className="absolute right-7 top-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                        {getDeviceCountForProfile('all')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 mt-1">Show all device types</span>
                  </SelectItem>
                  {deviceProfiles
                    .filter((profile) => profile.name.toLowerCase() !== 'default')
                    .map((profile) => {
                    const info = getProfileDisplayInfo(profile.name);
                    const count = getDeviceCountForProfile(profile.id.id);
                    return (
                      <SelectItem
                        key={profile.id.id}
                        value={profile.id.id}
                        className="font-paragraph-small text-[#5c5c5c] relative flex flex-col p-0 items-start"
                        style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px' }}
                      >
                        <style dangerouslySetInnerHTML={{
                          __html: `
                            [data-radix-select-item][data-state="checked"] [data-radix-select-item-indicator] {
                              display: none !important;
                            }
                          `
                        }} />
                        <div className="flex items-center w-full">
                          <span>{info.displayName}</span>
                          <span className="absolute right-7 top-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                            {count}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{info.description}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {isSidebarCollapsed ? (
          // Collapsed view - show device group icons
          <div className="flex flex-col gap-2 flex-1">
            {(() => {
              const desiredOrder = ["Camera", "Gateway", "Sensorbase", "File Uploader Device"];

              const sortedEntries = Object.entries(groupedDevices).sort(([a], [b]) => {
                const indexA = desiredOrder.indexOf(a);
                const indexB = desiredOrder.indexOf(b);

                const finalIndexA = indexA === -1 ? desiredOrder.length : indexA;
                const finalIndexB = indexB === -1 ? desiredOrder.length : indexB;

                return finalIndexA - finalIndexB;
              });

              return sortedEntries.map(([groupName, deviceList]) => {
                const getGroupIcon = (name: string) => {
                  switch (name) {
                    case "Camera":
                      return "/icons/camera-connected.svg";
                    case "Gateway":
                      return "/sensor-base.svg";
                    case "Sensorbase":
                      return "/sensor.svg";
                    case "File Uploader Device":
                      return <Upload className="w-8 h-8" />;
                    default:
                      return "/sensor.svg";
                  }
                };

                const deviceCount = deviceList.length;

                return (
                  <div
                    key={groupName}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 group"
                    title={groupName}
                  >
                    <div className="relative">
                      {typeof getGroupIcon(groupName) === 'string' ? (
                        <img
                          className="w-8 h-8"
                          alt={groupName}
                          src={getGroupIcon(groupName) as string}
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          {getGroupIcon(groupName)}
                        </div>
                      )}
                      {deviceCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[#E97132] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {deviceCount > 9 ? '9+' : deviceCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-4 flex-1 py-4">
            {/* Loading skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            <div className="text-red-500 text-sm text-center">
              <p className="mb-2">⚠️ Error loading devices</p>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 bg-[#E97132] text-white rounded text-xs hover:bg-[#E97132]/80"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {(() => {
              // Định nghĩa thứ tự hiển thị mong muốn
              const desiredOrder = ["Camera", "Gateway", "Sensorbase", "File Uploader Device"];

              // Sắp xếp groupedDevices theo thứ tự mong muốn
              const sortedEntries = Object.entries(groupedDevices).sort(([a], [b]) => {
                const indexA = desiredOrder.indexOf(a);
                const indexB = desiredOrder.indexOf(b);

                // Nếu không tìm thấy trong desiredOrder, đặt ở cuối
                const finalIndexA = indexA === -1 ? desiredOrder.length : indexA;
                const finalIndexB = indexB === -1 ? desiredOrder.length : indexB;

                return finalIndexA - finalIndexB;
              });

              return sortedEntries.map(([groupName, deviceList]) => (
                <Collapsible
                  key={groupName}
                  open={expandedGroups[groupName] ?? true}
                  onOpenChange={() => toggleGroupExpanded(groupName)}
                >
                <CollapsibleTrigger className="flex items-center gap-1 pt-2 pb-3 px-0 w-full hover:bg-gray-50 rounded">
                  <ChevronDownIcon
                    className={`w-[18px] h-[18px] transition-transform ${
                      (expandedGroups[groupName] ?? true) ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="flex-1 text-left [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                    {groupName}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-0">
                    {deviceList.map((device) => renderDeviceItem(device))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ));
            })()}
            {Object.keys(groupedDevices).length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No devices found.
                <br />
                <span className="text-xs">Try adjusting your search or filter criteria.</span>
              </div>
            )}
          </div>
        )}
      </main>
    </aside>
  );
};