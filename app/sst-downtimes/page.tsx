"use client";

import { useSST } from "../hooks/useSST";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type DowntimeType = "mechanical" | "electrical" | "technological" | "planned";

interface DowntimeEntry {
  startTime: string;
  endTime: string;
  duration: number;
  type: DowntimeType | "";
}

const SstDowntimesPage = () => {
  const currentDate = new Date();
  const pastDate = new Date(currentDate.getTime());
  pastDate.setDate(pastDate.getDate() - 1);
  const { data: downtimes = [] } = useSST({
    tag: "SST_FB_LONG_BELT_STR2",
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
          duration,
          type: "",
        }))
      );
    }
  }, [downtimes]);

  const handleTypeChange = (index: number, value: DowntimeType) => {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], type: value };
      return newEntries;
    });
  };

  const handleSubmit = () => {
    // Handle submission of all entries
    console.log("Submitting entries:", entries);
  };

  if (downtimes === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (downtimes === null) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: No data available
      </div>
    );
  }

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
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-1 rounded-lg ${
                  entry.type === "" ? "bg-red-50" : "bg-gray-50"
                }`}
              >
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
                  <span className="font-semibold md:hidden mr-2">Причина:</span>
                  <Select
                    value={entry.type}
                    onValueChange={(value: DowntimeType) =>
                      handleTypeChange(index, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanical">Механични</SelectItem>
                      <SelectItem value="technical">Технологични</SelectItem>
                      <SelectItem value="electrical">Електрически</SelectItem>
                      <SelectItem value="planned">ППР</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <Button onClick={handleSubmit} className="px-6">
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SstDowntimesPage;
