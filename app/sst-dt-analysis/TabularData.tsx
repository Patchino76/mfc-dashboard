"use client";

import { useSST } from "../hooks/useSST";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";

interface DowntimeEntry {
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
}
const downtimeTypes: string[] = ["механо", "електро", "технологични", "ппр"];

const tags = [
  "SST_FB_LONG_BELT_STR1",
  "SST_FB_LONG_BELT_STR2",
  "SST_FB_LONG_BELT_STR3",
  "SST_FB_LONG_BELT_STR4",
];
const currentDate = new Date();
const pastDate = new Date(currentDate.getTime());
pastDate.setDate(pastDate.getDate() - 1);

const TabularData = () => {
  const [selectedTag, setSelectedTag] = useState<string>(
    "SST_FB_LONG_BELT_STR2"
  );
  const { data: downtimes = [] } = useSST({
    tag: selectedTag,
    start: pastDate.toISOString(),
    end: currentDate.toISOString(),
  });
  console.log(pastDate, currentDate);

  const [entries, setEntries] = useState<DowntimeEntry[]>([]);

  // Initialize entries when downtimes data is loaded
  useEffect(() => {
    if (downtimes?.length > 0) {
      setEntries(
        downtimes.map(([start, end, duration]) => ({
          startTime: start,
          endTime: end,
          duration: duration,
          type: downtimeTypes[Math.floor(Math.random() * downtimeTypes.length)],
        }))
      );
    }
  }, [downtimes]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Престой на ССТ оборудване</CardTitle>
          <CardDescription>
            Преглед на престоите на Дълга лента 2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-0 font-semibold">
              <div>Начало</div>
              <div>Край</div>
              <div>Продължителност</div>
              <div>Причина</div>
            </div>

            {entries.map((entry, index) => (
              <div className="grid grid-cols-4 gap-4 items-center p-1 rounded-lg">
                <div className="flex items-center">
                  <span className="font-semibold md:hidden mr-2">Начало:</span>
                  <Input
                    value={entry.startTime}
                    readOnly
                    className="bg-white"
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-semibold md:hidden mr-2">Край:</span>
                  <Input value={entry.endTime} readOnly className="bg-white" />
                </div>
                <div className="flex items-center">
                  <span className="font-semibold md:hidden mr-2">
                    Продължителност:
                  </span>
                  <Input
                    value={`${entry.duration} min`}
                    readOnly
                    className="bg-white"
                  />
                </div>
                <div className="flex items-center">
                  <span className="font-semibold md:hidden mr-2">
                    Категория:
                  </span>
                  <Input value={entry.type} readOnly className="bg-white" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabularData;
