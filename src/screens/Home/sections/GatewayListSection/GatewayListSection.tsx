import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import React from "react";
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

export const GatewayListSection = (): JSX.Element => {
  return (
    <section className="flex items-start gap-2.5 p-5 relative flex-1 self-stretch grow">
      <div className="flex items-start justify-around gap-2.5 relative flex-1 self-stretch grow rounded-2xl overflow-hidden">
        <div className="flex flex-col items-start gap-4 p-4 relative flex-1 self-stretch grow bg-white">
          <header className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] bg-transparent">
            <h1 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-900 text-2xl tracking-[0] leading-8 relative flex-1">
              Gateway lists
            </h1>

            <div className="flex w-80 gap-3 items-center relative">
              <div className="flex-col gap-1 flex items-start relative flex-1 grow">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    placeholder="SearchIcon..."
                    className="pl-10 pr-2 py-2 bg-white rounded-lg border border-solid border-[#ebebeb] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-neutral-400 text-sm tracking-[-0.08px] leading-5"
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="flex-col flex-1 grow flex items-start relative self-stretch w-full">
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
                    className="bg-white hover:bg-gray-50 border-b border-gray-100"
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

          <div className="flex gap-6 self-stretch w-full items-center relative flex-[0_0_auto]">
            <div className="px-0 py-1.5 flex w-[200px] items-center gap-2 relative">
              <div className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm text-center tracking-[-0.08px] leading-5 whitespace-nowrap">
                1-10 of 10
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 relative flex-1 grow">
              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronsLeftIcon className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <span className="w-5 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-sm text-center tracking-[-0.08px] leading-5">
                  1
                </span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-auto p-1.5 bg-[#f7f7f7] border-0 hover:bg-gray-200"
              >
                <ChevronsRightIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="justify-end flex w-[200px] items-center gap-2 relative">
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
