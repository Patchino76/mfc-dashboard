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
          <CardTitle>SST Downtimes</CardTitle>
          <CardDescription>
            Review and classify equipment downtimes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                // className="grid grid-cols-4 gap-4 items-center p-4 rounded-lg bg-gray-50"
                className={`grid grid-cols-4 gap-4 items-center p-4 rounded-lg ${
                  entry.type === "" ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                <Input value={entry.startTime} readOnly className="bg-white" />
                <Input value={entry.endTime} readOnly className="bg-white" />
                <Input
                  value={`${entry.duration} min`}
                  readOnly
                  className="bg-white"
                />
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
