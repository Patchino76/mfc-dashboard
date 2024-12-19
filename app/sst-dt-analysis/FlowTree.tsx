"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TreeItem, treeItems } from "./treeItems";
import { ItemIcon } from "./ItemIcon";
import { useTreeFlowItems } from "../hooks/store";

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeItem[];
  level?: number;
  selectedItem?: string | null;
  onSelectItem?: (item: string) => void;
};

export function FlowTree({
  className,
  data,
  level = 0,
  selectedItem,
  onSelectItem,
  ...props
}: TreeProps) {
  return (
    <div className={cn("", className)} {...props}>
      {data.map((item, index) => (
        <TreeItemComponent
          key={index}
          item={item}
          level={level}
          isSelected={selectedItem === item.name}
          onSelect={() => onSelectItem && onSelectItem(item.name)}
        />
      ))}
    </div>
  );
}

function TreeItemComponent({
  item,
  level,
  isSelected,
  onSelect,
}: {
  item: TreeItem;
  level: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { selectedItem, setSelectedItem } = useTreeFlowItems();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-2 rounded-md transition-colors duration-200",
          level > 0 && "ml-4 border-l pl-4",
          "hover:bg-primary/10 cursor-pointer",
          isSelected && "bg-primary/20 font-semibold"
        )}
        onClick={handleSelect}
      >
        {item.children && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 mr-1"
            onClick={handleToggle}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        <div className="flex items-center">
          <ItemIcon name={item.name} />
          <span>{item.name}</span>
        </div>
      </div>
      {isOpen && item.children && (
        <FlowTree
          data={item.children}
          level={level + 1}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
      )}
    </div>
  );
}

export function FlowTreeCard() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  return (
    <Card className="w-full max-w-3xl ">
      <CardHeader>
        <CardTitle>Структура</CardTitle>
        <CardDescription>Потоци и компоненти</CardDescription>
      </CardHeader>
      <CardContent>
        <FlowTree
          data={treeItems}
          className="h-[750px] overflow-auto"
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />
        {/* {selectedItem && (
          <div className="mt-4 p-2 bg-secondary rounded-md">
            <p>Selected Item: {selectedItem}</p>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
