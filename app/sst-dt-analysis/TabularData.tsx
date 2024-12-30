"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { DowntimeFullEntry } from "./page";
import { useTreeFlowItems } from "../hooks/store";
import * as XLSX from "xlsx";

const reasons = [
  { value: "all", label: "Причина" },
  { value: "механо", label: "Механо" },
  { value: "електро", label: "Електро" },
  { value: "технологични", label: "Технологични" },
  { value: "ппр", label: "ППР" },
];

type SortColumn = "startTime" | "endTime" | "duration";
type SortDirection = "asc" | "desc";

const TabularData = ({ entries }: { entries: DowntimeFullEntry[] }) => {
  const { selectedTreeItem } = useTreeFlowItems();
  const [selectedReason, setSelectedReason] = useState("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("startTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const filteredEntries = useMemo(
    () =>
      selectedReason === "all"
        ? entries
        : entries.filter(
            (entry) => entry.type.toLowerCase() === selectedReason
          ),
    [entries, selectedReason]
  );

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (sortColumn === "startTime" || sortColumn === "endTime") {
        const aDate = parseISO(a[sortColumn]);
        const bDate = parseISO(b[sortColumn]);
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      } else {
        return sortDirection === "asc"
          ? a[sortColumn] - b[sortColumn]
          : b[sortColumn] - a[sortColumn];
      }
    });
  }, [filteredEntries, sortColumn, sortDirection]);

  const totalDuration = useMemo(
    () => sortedEntries.reduce((sum, entry) => sum + entry.duration, 0),
    [sortedEntries]
  );

  const totalHours = (totalDuration / 60).toFixed(2);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedEntries.map((entry) => ({
        Начало: format(parseISO(entry.startTime), "dd.MM.yyyy HH:mm"),
        Край: format(parseISO(entry.endTime), "dd.MM.yyyy HH:mm"),
        Продължителност: `${entry.duration} мин`,
        Причина: entry.type,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          {/* <CardTitle>Престой на {selectedTreeItem}</CardTitle> */}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[180px] cursor-pointer"
                  onClick={() => handleSort("startTime")}
                >
                  <div className="flex items-center">
                    Начало <SortIcon column="startTime" />
                  </div>
                </TableHead>
                <TableHead
                  className="w-[180px] cursor-pointer"
                  onClick={() => handleSort("endTime")}
                >
                  <div className="flex items-center">
                    Край <SortIcon column="endTime" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("duration")}
                >
                  <div className="flex items-center">
                    Продължителност <SortIcon column="duration" />
                  </div>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Select onValueChange={setSelectedReason} defaultValue="all">
                    <SelectTrigger className="w-[180px] border-none">
                      <SelectValue placeholder="Причина" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="mt-4">
              {sortedEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {format(parseISO(entry.startTime), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(entry.endTime), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{entry.duration} мин</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {entry.type}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-right font-medium">Общо:</TableCell>
                <TableCell className="font-medium">
                  <div>{totalDuration} мин</div>
                  <div>{totalHours} часа</div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
        <CardFooter>
          {" "}
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {" "}
            Export to Excel{" "}
          </button>{" "}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TabularData;
