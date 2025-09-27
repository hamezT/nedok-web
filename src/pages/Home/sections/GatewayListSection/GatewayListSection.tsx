import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  SettingsIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigation } from "../../../../hooks/useNavigation";
import { useWebSocket, useGatewayMeasurementStatus } from "../../../../hooks/useWebSocket";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { fetchGatewayDevices, fetchGatewayMeasurementAndUploadIntervalStatus, subscribeToGatewayMeasurementAndUploadIntervalStatus, unsubscribeFromGatewayMeasurementAndUploadIntervalStatus } from "../../../../services/deviceService";
import { DeviceInfo } from "../../../../types";

// Transform DeviceInfo to Gateway format
const transformGatewayData = (device: DeviceInfo, deviceAttributes?: Record<string, any>, isWebSocketConnected?: boolean) => {
  // Use WebSocket connection status if available, otherwise fall back to device.active
  const isActive = isWebSocketConnected !== undefined ? isWebSocketConnected : device.active;

  // Get measurement status from API attributes
  const measurementStartedAttr = deviceAttributes?.measurement_started?.[0];
  const isMeasurementStarted = measurementStartedAttr?.value ?? isActive;

  // Get upload interval from API attributes and convert from seconds to minutes
  let uploadInterval = "-"; // default fallback

  // Debug: Log device attributes to see structure
  console.log(`Device ${device.name} full attributes:`, deviceAttributes);

  // Try different ways to access upload_interval_time
  let uploadIntervalAttr = null;

  // Case 1: Array of attribute objects (from API response)
  if (Array.isArray(deviceAttributes)) {
    uploadIntervalAttr = deviceAttributes.find(attr => attr.key === 'upload_interval_time');
  }
  // Case 2: Object with nested array
  else if (deviceAttributes?.upload_interval_time && Array.isArray(deviceAttributes.upload_interval_time)) {
    uploadIntervalAttr = deviceAttributes.upload_interval_time[0];
  }

  if (uploadIntervalAttr?.value) {
    const seconds = uploadIntervalAttr.value;
    const minutes = Math.floor(seconds / 60);
    uploadInterval = `${minutes} mins`;
    console.log(`Device ${device.name}: ${seconds}s -> ${minutes} mins`);
  } else {
    console.log(`Device ${device.name}: No upload interval found. Using default: ${uploadInterval}`);
  }

  return {
    name: device.name,
    status: isActive ? "Online" : "Offline",
    statusColor: isActive ? "#1fc06a" : "#7b7b7b",
    measurement: isMeasurementStarted ? "Started" : "Stopped",
    measurementType: isMeasurementStarted ? "started" : "stopped",
    uploadInterval: uploadInterval,
  };
};

const GatewayCard = ({
  gateway,
  onClick
}: {
  gateway: ReturnType<typeof transformGatewayData>,
  onClick: (name: string) => void
}) => {
  return (
    <div 
      className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-[#ebebeb] shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={() => onClick(gateway.name)}
    >
      <div className="flex items-center justify-between">
        <h3 className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-base">
          {gateway.name}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="w-7 h-7 p-1 bg-white border border-solid border-[#ebebeb] shadow-regular-shadow-x-small rounded-lg hover:bg-gray-50"
        >
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="inline-flex items-center justify-center gap-0.5 pl-1 pr-2 py-1 bg-white rounded-md border border-solid border-[#ebebeb]">
          <div className="relative w-4 h-4">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-[3px]"
              style={{ backgroundColor: gateway.statusColor }}
            />
          </div>
          <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0] leading-4 whitespace-nowrap">
            {gateway.status}
          </span>
        </div>

        <Badge
          variant="secondary"
          className={`h-6 px-2 py-0.5 rounded-[999px] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-xs tracking-[0] leading-4 ${
            gateway.measurementType === "started"
              ? "bg-[#e0faec] text-[#1fc06a] hover:bg-[#e0faec]"
              : "bg-[#ebebeb] text-neutral-800 hover:bg-[#ebebeb]"
          }`}
        >
          {gateway.measurement}
        </Badge>

        <div className="[font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm">
          {gateway.uploadInterval}
        </div>
      </div>
    </div>
  );
};

export const GatewayListSection = (): JSX.Element => {
  const { navigateToSensorData } = useNavigation();
  const [gatewayDevices, setGatewayDevices] = useState<DeviceInfo[]>([]);
  const [measurementStatus, setMeasurementStatus] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // WebSocket integration
  const { isConnected, error: wsError } = useWebSocket({
    onConnectionChange: (connected) => {
      console.log('WebSocket connection status:', connected);
    },
    onError: (err) => {
      console.error('WebSocket error:', err);
    }
  });

  // Update error state to include WebSocket errors
  const displayError = error || wsError?.message;


  useEffect(() => {
    const loadGatewayDevices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch gateway devices with pagination
        const params = {
          pageSize: pageSize,
          page: currentPage,
          ...(searchText.trim() && { textSearch: searchText.trim() })
        };

        console.log('API Parameters:', params);
        console.log('Pagination state - pageSize:', pageSize, 'currentPage:', currentPage);

        const result = await fetchGatewayDevices(params);
        let devices = result.data;

        // Debug: Log API response
        console.log('API Response:', result);
        console.log('Raw devices from API:', devices);
        console.log('Device types:', devices.map(d => ({
          name: d.name,
          type: d.type,
          gateway: d.additionalInfo?.gateway,
          active: d.active
        })));

        // Update pagination info
        setTotalPages(result.totalPages || 0);
        setTotalElements(result.totalElements || 0);

        // Sort devices: Online first, then Offline, then alphabetical by name
        const sortedDevices = [...devices].sort((a, b) => {
          // First sort by status: Online (true) comes before Offline (false)
          if (a.active && !b.active) return -1;
          if (!a.active && b.active) return 1;

          // If status is the same, sort alphabetically by name
          return a.name.localeCompare(b.name);
        });

        console.log('Original devices:', devices.map(d => `${d.name} (${d.active ? 'Online' : 'Offline'})`));
        console.log('Sorted devices:', sortedDevices.map(d => `${d.name} (${d.active ? 'Online' : 'Offline'})`));
        setGatewayDevices(sortedDevices);

        // Fetch measurement status for all devices
        if (sortedDevices.length > 0) {
          const deviceIds = sortedDevices.map(device => device.id.id);
          console.log('Fetching measurement status for devices:', deviceIds);

          try {
            const measurementStatusMap = await fetchGatewayMeasurementAndUploadIntervalStatus(deviceIds, ["measurement_started", "upload_interval_time"]);
            console.log('Received measurement status:', measurementStatusMap);
            setMeasurementStatus(measurementStatusMap);
          } catch (attrError) {
            console.error('Failed to fetch measurement status:', attrError);
            setMeasurementStatus({});
          }
        } else {
          setMeasurementStatus({});
        }
      } catch (err) {
        console.error('Failed to fetch gateway devices:', err);
        setError('Failed to load gateway devices. Please try again later.');
        setGatewayDevices([]);
        setMeasurementStatus({});
      } finally {
        setLoading(false);
      }
    };

    loadGatewayDevices();
  }, [searchText, currentPage, pageSize]);

  // WebSocket subscription management - using the new hook
  const { data: wsMeasurementData, isConnected: wsConnected } = useGatewayMeasurementStatus(
    gatewayDevices.map(device => device.id.id),
    true // Always enabled when we have devices
  );

  // Merge REST API data with WebSocket data
  useEffect(() => {
    if (wsMeasurementData && Object.keys(wsMeasurementData).length > 0) {
      setMeasurementStatus(prev => ({ ...prev, ...wsMeasurementData }));
    }
  }, [wsMeasurementData]);

  const handleRowClick = (gatewayName: string) => {
    console.log("Row clicked with gateway name:", gatewayName); // Debug log
    navigateToSensorData(gatewayName);
  };

  // Pagination handlers
  const handleFirstPage = () => setCurrentPage(0);
  const handleLastPage = () => setCurrentPage(totalPages - 1);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  return (
    <section className="flex items-start gap-2.5 p-2 lg:p-5 relative flex-1 self-stretch grow">
      <div className="flex items-start justify-around gap-2.5 relative flex-1 self-stretch grow rounded-2xl overflow-hidden">
        <div className="flex flex-col items-start gap-4 p-2 lg:p-4 relative flex-1 self-stretch grow bg-white">
          <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative self-stretch w-full flex-[0_0_auto] bg-transparent">
            <div className="flex items-center gap-2">
              <h1 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-900 text-xl lg:text-2xl tracking-[0] leading-8">
                Gateway lists
              </h1>
            </div>

            <div className="flex w-full lg:w-80 items-center relative">
              <div className="flex items-center w-full">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    placeholder="Search gateways..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-2 py-2 bg-white rounded-lg border border-solid border-[#ebebeb] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-400 text-sm tracking-[-0.08px] leading-5"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Desktop View */}
          <div className="hidden lg:flex flex-col flex-1 grow items-start relative self-stretch w-full overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E97132]"></div>
                <p className="mt-2 text-sm text-gray-500">Loading gateways...</p>
              </div>
            ) : displayError ? (
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <div className="text-red-500 text-sm text-center">
                  <p className="mb-2">⚠️ Error loading gateways</p>
                  <p>{displayError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-[#E97132] text-white rounded text-xs hover:bg-[#E97132]/80"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-[#f7f7f7] hover:bg-[#f7f7f7]">
                    <TableHead className="px-3 py-2 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      Gateway name
                    </TableHead>
                    <TableHead className="w-[132px] px-3 py-2 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      Status
                    </TableHead>
                    <TableHead className="w-[136px] px-3 py-2 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      <div className="flex items-center gap-0.5">
                        Measurement
                        <ArrowUpDownIcon className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[156px] px-3 py-2 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                      Upload interval time
                    </TableHead>
                    <TableHead className="w-[68px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gatewayDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No gateways found.
                        <br />
                        <span className="text-xs">Try adjusting your search criteria.</span>
                      </TableCell>
                    </TableRow>
                  ) : (
                    gatewayDevices.map((device) => {
                      const deviceMeasurementStatus = measurementStatus[device.id.id] || {};
                      const gateway = transformGatewayData(device, deviceMeasurementStatus, wsConnected);
                      return (
                        <TableRow
                          key={device.id.id}
                          className="bg-white hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                          onClick={() => handleRowClick(gateway.name)}
                        >
                          <TableCell className="px-3 py-3 [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-900 text-sm tracking-[-0.08px] leading-5">
                            {gateway.name}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <div className="inline-flex items-center justify-center gap-0.5 pl-1 pr-2 py-1 bg-white rounded-md border border-solid border-[#ebebeb]">
                              <div className="relative w-4 h-4">
                                <div
                                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-[3px]"
                                  style={{ backgroundColor: gateway.statusColor }}
                                />
                              </div>
                              <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0] leading-4 whitespace-nowrap">
                                {gateway.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <Badge
                              variant="secondary"
                              className={`h-6 px-2 py-0.5 rounded-[999px] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-xs tracking-[0] leading-4 ${
                                gateway.measurementType === "started"
                                  ? "bg-[#e0faec] text-[#1fc06a] hover:bg-[#e0faec]"
                                  : "bg-[#ebebeb] text-neutral-800 hover:bg-[#ebebeb]"
                              }`}
                            >
                              {gateway.measurement}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-3 py-3 [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-900 text-sm tracking-[-0.08px] leading-5">
                            {gateway.uploadInterval}
                          </TableCell>
                          <TableCell className="px-3 py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-7 h-7 p-1 bg-white border border-solid border-[#ebebeb] shadow-regular-shadow-x-small rounded-lg hover:bg-gray-50"
                            >
                              <SettingsIcon className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Mobile View */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E97132]"></div>
                <p className="mt-2 text-sm text-gray-500">Loading gateways...</p>
              </div>
            ) : displayError ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-red-500 text-sm text-center">
                  <p className="mb-2">⚠️ Error loading gateways</p>
                  <p>{displayError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-[#E97132] text-white rounded text-xs hover:bg-[#E97132]/80"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : gatewayDevices.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                No gateways found.
                <br />
                <span className="text-xs">Try adjusting your search criteria.</span>
              </div>
            ) : (
              gatewayDevices.map((device) => {
                const deviceMeasurementStatus = measurementStatus[device.id.id] || {};
                const gateway = transformGatewayData(device, deviceMeasurementStatus, wsConnected);
                return (
                  <GatewayCard key={device.id.id} gateway={gateway} onClick={handleRowClick} />
                );
              })
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 self-stretch w-full items-center relative flex-[0_0_auto]">
            <div className="hidden lg:block [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5 w-[200px] text-left">
              {totalElements > 0 ? `${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalElements)} of ${totalElements}` : "0 of 0"}
            </div>

            <div className="flex items-center justify-center gap-2 flex-1 order-2 lg:order-none">
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
                onClick={handleFirstPage}
                disabled={currentPage === 0}
              >
                <ChevronsLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <span className="w-4 lg:w-5 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-sm text-center tracking-[-0.08px] leading-5">
                  {currentPage + 1}
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
                onClick={handleLastPage}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronsRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>

            <div className="flex lg:hidden items-center text-sm text-[#5c5c5c] order-1 lg:order-none">
              {totalElements > 0 ? `${currentPage * pageSize + 1}-${Math.min((currentPage + 1) * pageSize, totalElements)} of ${totalElements}` : "0 of 0"}
            </div>

            <div className="w-auto lg:w-[200px] flex justify-end order-3 lg:order-none">
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-auto pl-2.5 pr-1.5 py-1.5 bg-white rounded-lg border border-solid border-[#ebebeb] shadow-regular-shadow-x-small [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm text-center tracking-[-0.08px] leading-5">
                  <SelectValue />
                  <span className="ml-1">/ page</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};