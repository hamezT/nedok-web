import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Maximize2Icon,
  SettingsIcon,
} from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const gatewayData = {
  name: "Gateway 0",
  status: "Online",
  measurement: "Started",
  uploadInterval: "3 minutes",
};


const sensorData = [
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "SBYYMMDDXXX",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
  {
    id: "1CA7B9AB6224_SB_1CA7B9AB6224_1",
    status: "Check",
    lastUpdated: { date: "2025-01-05", time: "10:25:04" },
    atmPressure: "382 hPa",
    carbonDioxide: "844 ppm",
    humidity: "66.8 %",
    soilEC: "-",
    soilMoisture: "66.8 %",
    soilTemperature: "99.1 ℃",
    temperature: "-",
    sensor1: "-",
    sensor2: "-",
  },
];

export const SensorDataSection = (): JSX.Element => {
  return (
    <section className="flex items-start gap-2.5 p-5 flex-1 self-stretch grow">
      <Card className="flex-1 self-stretch grow rounded-2xl overflow-hidden">
        <CardHeader className="items-start gap-6 p-5 bg-white border-b border-[#ebebeb]">
          <div className="flex flex-col items-start gap-4 flex-1 grow">
            <div className="inline-flex items-end gap-3">
              <div className="inline-flex flex-col items-start justify-center gap-1">
                <h1 className="[font-family:'Inter',Helvetica] font-semibold text-neutral-900 text-2xl tracking-[0] leading-8 whitespace-nowrap">
                  {gatewayData.name}
                </h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-1 p-1.5 bg-white border border-[#ebebeb] shadow-regular-shadow-x-small"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-start gap-4 max-w-[555px]">
              <div className="w-[180px] gap-1.5 flex flex-col items-start">
                <div className="flex items-baseline gap-1 self-stretch w-full">
                  <span className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0.48px] leading-4">
                    STATUS
                  </span>
                </div>
                <div className="inline-flex items-center justify-center gap-0.5 pl-1 pr-2 py-1 bg-white rounded-md border border-[#ebebeb]">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#1fc06a] rounded-[3px]" />
                  </div>
                  <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0] leading-4 whitespace-nowrap">
                    {gatewayData.status}
                  </span>
                </div>
              </div>

              <div className="w-[180px] gap-1.5 flex flex-col items-start">
                <div className="flex items-baseline gap-1 self-stretch w-full">
                  <span className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0.48px] leading-4">
                    MEASUREMENT
                  </span>
                </div>
                <Badge className="h-6 px-2 py-0.5 bg-[#e0faec] text-[#1fc06a] rounded-[999px] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-xs tracking-[0] leading-4">
                  {gatewayData.measurement}
                </Badge>
              </div>

              <div className="flex-col w-[180px] gap-1.5 flex items-start">
                <div className="inline-flex items-baseline gap-1">
                  <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-xs tracking-[0.48px] leading-4 whitespace-nowrap">
                    UPLOAD INTERVAL TIME
                  </span>
                </div>
                <div className="inline-flex items-baseline gap-1">
                  <span className="[font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-base tracking-[-0.18px] leading-6 whitespace-nowrap">
                    {gatewayData.uploadInterval}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-start gap-3 p-5 flex-1 self-stretch w-full grow bg-white">
          <div className="items-center gap-4 flex self-stretch w-full">
            <h2 className="flex-1 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-lg tracking-[-0.27px] leading-6">
              Sensor base list
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="w-7 h-7 p-1 bg-white border border-[#ebebeb] shadow-regular-shadow-x-small"
            >
              <Maximize2Icon className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-4 flex-1 self-stretch w-full grow">
            <div className="bg-white rounded-lg border border-[#ebebeb] shadow-regular-shadow-x-small overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ebebeb]">
                      <th className="text-left p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5 min-w-[120px]">
                        Sensor
                      </th>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <th key={index} className="text-center p-4 bg-[#f8f9fa] min-w-[120px]">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-[#1fc06a] rounded-full"></div>
                              <span className="text-[#335cff] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm tracking-[-0.08px] leading-5">
                                SBYY
                              </span>
                            </div>
                            <div className="text-[#335cff] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm tracking-[-0.08px] leading-5">
                              MMDD
                            </div>
                            <div className="text-[#335cff] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm tracking-[-0.08px] leading-5">
                              XXX
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Status Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Status
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-[#1fc06a] rounded-full"></div>
                              <span className="text-[#1fc06a] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-xs tracking-[0] leading-4">
                                LoRa
                              </span>
                            </div>
                            <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                              Check
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Last Updated Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Last updated
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                              {sensor.lastUpdated.date}
                            </span>
                            <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                              {sensor.lastUpdated.time}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Atm Pressure Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Atm Pressure
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.atmPressure}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Carbon Dioxide Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Carbon Dioxide
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.carbonDioxide}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Humidity Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Humidity
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.humidity}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Soil EC Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Soil EC
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.soilEC}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Soil Moisture Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Soil Moisture
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.soilMoisture}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Soil Temperature Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Soil Temperature
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.soilTemperature}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Temperature Row */}
                    <tr className="border-b border-[#ebebeb]">
                      <td className="p-4 bg-[#f8f9fa] [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-[#5c5c5c] text-sm tracking-[-0.08px] leading-5">
                        Temperature
                      </td>
                      {sensorData.slice(0, 9).map((sensor, index) => (
                        <td key={index} className="p-4 text-center">
                          <span className="text-[#5c5c5c] [font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-sm tracking-[-0.08px] leading-5">
                            {sensor.temperature}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex gap-6 self-stretch w-full items-center">
            <div className="px-0 py-1.5 flex w-[200px] items-center gap-2">
              <span className="[font-family:'SF_Pro_Text-Regular',Helvetica] font-normal text-[#5c5c5c] text-sm text-center tracking-[-0.08px] leading-5 whitespace-nowrap">
                1-10 of 10
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 flex-1 grow">
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-1 p-1.5 bg-[#f7f7f7]"
              >
                <ChevronsLeftIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-1 p-1.5 bg-[#f7f7f7]"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-2.5 p-1.5 bg-[#f7f7f7]"
              >
                <span className="w-5 [font-family:'SF_Pro_Text-Medium',Helvetica] font-medium text-neutral-900 text-sm text-center tracking-[-0.08px] leading-5">
                  1
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-1 p-1.5 bg-[#f7f7f7]"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-auto gap-1 p-1.5 bg-[#f7f7f7]"
              >
                <ChevronsRightIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="justify-end flex w-[200px] items-center gap-2">
              <Select defaultValue="7">
                <SelectTrigger className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1.5 bg-white rounded-lg border border-[#ebebeb] shadow-regular-shadow-x-small">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 / page</SelectItem>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
