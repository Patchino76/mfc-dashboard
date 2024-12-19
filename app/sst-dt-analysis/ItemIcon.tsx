import {
  Box,
  Workflow,
  Route,
  Droplet,
  ListFilter,
  Forklift,
  Gauge,
  Hammer,
  type LucideIcon,
  LightbulbIcon as LucideProps,
  Pipette,
  PowerIcon as Pump,
  Siren,
  Repeat,
} from "lucide-react";

import ConveyorIcon from "Icons/conveyor_belt.png";

const iconMap: { [key: string]: LucideIcon } = {
  Питател: Repeat,
  лента: Route,
  сито: ListFilter,
  Течка: Droplet,
  Трошачка: Hammer,
  "Маслена станция": Gauge,
  ССТ: Siren,
  ПВ: Pump,
  МБ: Forklift,
  "Захранваща лента": Route,
  Поток: Workflow,
};

export function ItemIcon({ name, ...props }: { name: string }) {
  const Icon =
    Object.entries(iconMap).find(([key]) => name.includes(key))?.[1] || Box;
  return <Icon {...props} className="h-4 w-4  mr-2" />;
}
