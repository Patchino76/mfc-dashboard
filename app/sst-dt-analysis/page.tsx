"use client";
import { JKD } from "./JKD";
import ParetoDtSst from "./ParetoDtSst";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AudioWaveform, Clock } from "lucide-react";
import { FlowTreeCard } from "./FlowTree";
import { useDtAnalysisType, useTreeFlowItems } from "../hooks/store";
import { useEffect, useState } from "react";
import TabularData from "./TabularData";
import { useSST } from "../hooks/useSST";

export interface DowntimeFullEntry {
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
}
const downtimeTypes: string[] = ["механо", "електро", "технологични", "ппр"];
const sstTags = [
  "SST_FB_LONG_BELT_STR1",
  "SST_FB_LONG_BELT_STR2",
  "SST_FB_LONG_BELT_STR3",
  "SST_FB_LONG_BELT_STR4",
];

const currentDate = new Date();
const pastDate = new Date(currentDate.getTime());
pastDate.setDate(pastDate.getDate() - 1);

const sampleData = [
  { reason: "Механо", mttr: 2.5, totalEvents: 30, totalDowntime: 75 },
  { reason: "Електро", mttr: 1.8, totalEvents: 55, totalDowntime: 99 },
  { reason: "Технологични", mttr: 3.2, totalEvents: 20, totalDowntime: 64 },
  { reason: "Системни", mttr: 0.9, totalEvents: 70, totalDowntime: 63 },
  { reason: "ППР", mttr: 4.5, totalEvents: 10, totalDowntime: 45 },
];

export default function SstDowntimeAnalysisPage() {
  const { selectedTreeItem: selectedItem } = useTreeFlowItems();
  const { type, label, setType } = useDtAnalysisType();
  const [downtimeData, setDowntimeData] = useState([
    { reason: "", mttr: 0, total: 0, label: "", unit: "" },
  ]);

  useEffect(() => {
    const modifySampleData = () => {
      const modifiedData = sampleData.map((item) => ({
        reason: item.reason,
        mttr: Number(
          (item.mttr + (Math.random() > 0.5 ? 1 : -1) * Math.random()).toFixed(
            2
          )
        ), // Randomly add or subtract up to 1
        total:
          type === "downtime"
            ? item.totalDowntime + Math.floor(Math.random() * 5)
            : item.totalEvents + Math.floor(Math.random() * 5),
        label: type === "downtime" ? "Продължителност" : "Събития",
        unit: type === "downtime" ? "часа" : "бр.",
      }));
      // console.log(modifiedData);
      setDowntimeData(modifiedData);
    };

    modifySampleData();
  }, [selectedItem, type]);

  // tree handling changes -------------------------------------
  // const [selectedTreeItem, setSelectedTreeItem] = useState<string | null>(null);
  const { selectedTreeItem } = useTreeFlowItems();
  console.log(selectedTreeItem);

  //tabular data ------------------------------------------------

  const [selectedTag, setSelectedTag] = useState<string>(
    "SST_FB_LONG_BELT_STR2"
  );
  const { data: downtimes = [] } = useSST({
    tag: selectedTag,
    start: pastDate.toISOString(),
    end: currentDate.toISOString(),
  });
  useEffect(() => {
    if (downtimes?.length > 0) {
      setSstDtArray(
        downtimes.map(([start, end, duration]) => ({
          startTime: start,
          endTime: end,
          duration: duration,
          type: downtimeTypes[Math.floor(Math.random() * downtimeTypes.length)],
        }))
      );
      // console.log(sstDtArray);
      // console.log(selectedTreeItem);
      setSelectedTag(sstTags[Math.floor(Math.random() * sstTags.length)]);
    }
  }, [downtimes, selectedTreeItem]);

  const [sstDtArray, setSstDtArray] = useState<DowntimeFullEntry[]>([]);

  return (
    <div className="p-3 flex flex-row gap-3">
      <div className="w-[15%] flex flex-col gap-3">
        <FlowTreeCard />
      </div>

      <Card className="w-[85%]  flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-0">
          <CardTitle className="text-2xl font-medium justify-between">
            ССТ - престои на {selectedTreeItem}
          </CardTitle>
          <div className="flex items-center gap-2">
            <AudioWaveform className="scale-75" />
            <Switch
              checked={type === "frequency"}
              onCheckedChange={() => {
                if (type === "frequency")
                  setType("downtime", "Продължителност");
                else setType("frequency", "Събития");
              }}
              className="scale-75"
            />
            <Clock className="scale-75" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-3">
          <Tabs defaultValue="pareto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pareto">Парето</TabsTrigger>
              <TabsTrigger value="jdk">JKD</TabsTrigger>
              <TabsTrigger value="table">Таблично</TabsTrigger>
            </TabsList>
            <TabsContent value="pareto">
              <ParetoDtSst sampleData={downtimeData} />
            </TabsContent>
            <TabsContent value="jdk">
              <JKD sampleData={downtimeData} />
            </TabsContent>
            <TabsContent value="table">
              <TabularData entries={sstDtArray} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
