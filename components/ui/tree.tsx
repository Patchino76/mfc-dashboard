import * as React from "react";
import { ChevronRight, ChevronDown, Folder, File, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface TreeItem {
  id: string;
  name: string;
  icon?: React.ReactNode;
  children?: TreeItem[];
}

interface TreeProps {
  items: TreeItem[];
  className?: string;
  defaultExpanded?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

interface TreeNodeProps extends TreeItem {
  level: number;
  defaultExpanded?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const TreeNode = ({
  id,
  name,
  icon,
  children,
  level,
  defaultExpanded = false,
  selectedId,
  onSelect,
}: TreeNodeProps) => {
  const [isOpen, setIsOpen] = React.useState(defaultExpanded);
  const hasChildren = children && children.length > 0;
  const isSelected = id === selectedId;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-lg hover:bg-accent cursor-pointer",
          "transition-colors duration-150",
          isSelected && "bg-accent"
        )}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) {
            setIsOpen(!isOpen);
          }
          onSelect?.(id);
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-4 w-4 p-0 hover:bg-transparent",
            !hasChildren && "invisible"
          )}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 ml-1 flex-1">
          {icon ||
            (hasChildren ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <File className="h-4 w-4 text-gray-500" />
            ))}
          <span className="text-sm">{name}</span>
          {isSelected && (
            <Check className="h-4 w-4 ml-auto text-primary" />
          )}
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-2">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              {...child}
              level={level + 1}
              defaultExpanded={defaultExpanded}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function Tree({ items, className, defaultExpanded = false, selectedId, onSelect }: TreeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground",
        className
      )}
    >
      {items.map((item) => (
        <TreeNode
          key={item.id}
          {...item}
          level={1}
          defaultExpanded={defaultExpanded}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
