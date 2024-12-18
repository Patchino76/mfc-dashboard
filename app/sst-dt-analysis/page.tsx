"use client";
import { JKD } from "./JKD";
import ParetoDtSst from "./ParetoDtSst";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AudioWaveform, Clock } from "lucide-react";

const sampleData = [
  { reason: "Механо", mttr: 2.5, totalEvents: 30 },
  { reason: "Електро", mttr: 1.8, totalEvents: 45 },
  { reason: "Технологични", mttr: 3.2, totalEvents: 20 },
  { reason: "Системни", mttr: 0.9, totalEvents: 60 },
  { reason: "ППР", mttr: 4.5, totalEvents: 15 },
];

export default function SstDowntimeAnalysisPage() {
  return (
    <div className="h-fit p-3 flex flex-col gap-3">
      <Card className="w-[60%] flex flex-col">
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
              <ParetoDtSst sampleData={sampleData} />
            </TabsContent>
            <TabsContent value="jdk">
              <JKD data={sampleData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
