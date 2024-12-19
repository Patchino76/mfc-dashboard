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
import { useTreeFlowItems } from "../hooks/store";
import { useEffect, useState } from "react";

const sampleData = [
  { reason: "Механо", mttr: 2.5, totalEvents: 30 },
  { reason: "Електро", mttr: 1.8, totalEvents: 55 },
  { reason: "Технологични", mttr: 3.2, totalEvents: 20 },
  { reason: "Системни", mttr: 0.9, totalEvents: 70 },
  { reason: "ППР", mttr: 4.5, totalEvents: 10 },
];

export default function SstDowntimeAnalysisPage() {
  const { selectedItem } = useTreeFlowItems();
  const [downtimeData, setDowntimeData] = useState(sampleData);

  useEffect(() => {
    const modifySampleData = () => {
      const modifiedData = sampleData.map((item) => ({
        reason: item.reason,
        mttr: Number(
          (item.mttr + (Math.random() > 0.5 ? 1 : -1) * Math.random()).toFixed(
            2
          )
        ), // Randomly add or subtract up to 1
        totalEvents: item.totalEvents + Math.floor(Math.random() * 5), // Randomly add 0 to 4
      }));
      console.log(modifiedData);
      setDowntimeData(modifiedData);
    };

    modifySampleData();
  }, [selectedItem]);

  return (
    <div className="p-3 flex flex-row gap-3">
      <div className="w-[15%] flex flex-col gap-3">
        <FlowTreeCard />
      </div>

      <Card className="w-[85%]  flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-0">
          <CardTitle className="text-2xl font-medium justify-between">
            ССТ - Анализ на престои
          </CardTitle>
          <div className="flex items-center gap-2">
            <AudioWaveform className="scale-75" />
            <Switch
              checked={true}
              onCheckedChange={() => {}}
              className="scale-75"
            />
            <Clock className="scale-75" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-3">
          <Tabs defaultValue="pareto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pareto">Парето</TabsTrigger>
              <TabsTrigger value="jdk">JKD</TabsTrigger>
            </TabsList>
            <TabsContent value="pareto">
              <ParetoDtSst sampleData={downtimeData} />
            </TabsContent>
            <TabsContent value="jdk">
              <JKD data={downtimeData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
