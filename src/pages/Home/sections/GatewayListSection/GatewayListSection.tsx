import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { useNavigation } from "../../../../hooks/useNavigation";
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

const gatewayData = [
  {
    name: "GW7890123",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW4567890",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW2468135",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW6543210",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW3210987",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW9876543",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW1357924",
    status: "Online",
    statusColor: "#1fc06a",
    measurement: "Started",
    measurementType: "started",
    uploadInterval: "3 mins",
  },
  {
    name: "GW1234567",
    status: "Offline",
    statusColor: "#7b7b7b",
    measurement: "Stopped",
    measurementType: "stopped",
    uploadInterval: "3 mins",
  },
];

const GatewayCard = ({ 
  gateway,
  onClick
}: { 
  gateway: typeof gatewayData[0],
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

  const handleRowClick = (gatewayName: string) => {
    console.log("Row clicked with gateway name:", gatewayName); // Debug log
    navigateToSensorData(gatewayName);
  };
  return (
    <section className="flex items-start gap-2.5 p-2 lg:p-5 relative flex-1 self-stretch grow">
      <div className="flex items-start justify-around gap-2.5 relative flex-1 self-stretch grow rounded-2xl overflow-hidden">
        <div className="flex flex-col items-start gap-4 p-2 lg:p-4 relative flex-1 self-stretch grow bg-white">
          <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative self-stretch w-full flex-[0_0_auto] bg-transparent">
            <h1 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-900 text-xl lg:text-2xl tracking-[0] leading-8">
              Gateway lists
            </h1>

            <div className="flex w-full lg:w-80 gap-3 items-center relative">
              <div className="flex-col gap-1 flex items-start relative flex-1 grow">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    placeholder="Search..."
                    className="w-full pl-10 pr-2 py-2 bg-white rounded-lg border border-solid border-[#ebebeb] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-400 text-sm tracking-[-0.08px] leading-5"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Desktop View */}
          <div className="hidden lg:flex flex-col flex-1 grow items-start relative self-stretch w-full overflow-x-auto">
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
                {gatewayData.map((gateway, index) => (
                  <TableRow
                    key={index}
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="flex lg:hidden flex-col gap-3 w-full">
            {gatewayData.map((gateway, index) => (
              <GatewayCard key={index} gateway={gateway} onClick={handleRowClick} />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 self-stretch w-full items-center relative flex-[0_0_auto]">
            <div className="hidden lg:block [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5 w-[200px] text-left">
              1-10 of 10
            </div>

            <div className="flex items-center justify-center gap-2 flex-1 order-2 lg:order-none">
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronsLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronLeftIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <span className="w-4 lg:w-5 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-sm text-center tracking-[-0.08px] leading-5">
                  1
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronsRightIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              </Button>
            </div>

            <div className="flex lg:hidden items-center text-sm text-[#5c5c5c] order-1 lg:order-none">
              1-10 of 10
            </div>

            <div className="w-auto lg:w-[200px] flex justify-end order-3 lg:order-none">
              <Select defaultValue="7">
                <SelectTrigger className="w-auto pl-2.5 pr-1.5 py-1.5 bg-white rounded-lg border border-solid border-[#ebebeb] shadow-regular-shadow-x-small [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm text-center tracking-[-0.08px] leading-5">
                  <SelectValue />
                  <span className="ml-1">/ page</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};