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

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeItem[];
  level?: number;
  selectedItem?: string | null;
  onSelectItem?: (item: string | null, parent: string | null) => void;
  selectedParent?: string | null;
};

export function FlowTree({
  className,
  data,
  level = 0,
  selectedItem,
  onSelectItem,
  selectedParent,
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
          onSelect={(itemName) =>
            onSelectItem &&
            onSelectItem(itemName, level === 0 ? item.name : selectedParent)
          }
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          selectedParent={selectedParent}
          isExpanded={level === 0 && item.name === selectedParent}
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
  selectedItem,
  onSelectItem,
  selectedParent,
  isExpanded: initialIsExpanded,
}: {
  item: TreeItem;
  level: number;
  isSelected: boolean;
  onSelect: (itemName: string) => void;
  selectedItem?: string | null;
  onSelectItem?: (item: string | null, parent: string | null) => void;
  selectedParent?: string | null;
  isExpanded: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(initialIsExpanded);

  React.useEffect(() => {
    setIsOpen(initialIsExpanded);
  }, [initialIsExpanded]);

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item.name);
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
        <ItemIcon
          name={item.name}
          className={cn("mr-2 h-4 w-4", isSelected && "text-primary")}
        />
        <span>{item.name}</span>
      </div>
      {isOpen && item.children && (
        <FlowTree
          data={item.children}
          level={level + 1}
          selectedItem={selectedItem}
          onSelectItem={onSelectItem}
          selectedParent={selectedParent}
        />
      )}
    </div>
  );
}

export function FlowTreeCard() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [selectedParent, setSelectedParent] = React.useState<string | null>(
    null
  );

  const handleSelectItem = (item: string | null, parent: string | null) => {
    setSelectedItem(item);
    setSelectedParent(parent);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Flow Tree</CardTitle>
        <CardDescription>13 Поток and their components</CardDescription>
      </CardHeader>
      <CardContent>
        <FlowTree
          data={treeItems}
          className="max-h-[600px] overflow-auto"
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          selectedParent={selectedParent}
        />
        {selectedItem && (
          <div className="mt-4 p-2 bg-secondary rounded-md">
            <p>
              {selectedParent && selectedParent !== selectedItem
                ? `Selected: ${selectedParent} - ${selectedItem}`
                : `Selected: ${selectedItem}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
