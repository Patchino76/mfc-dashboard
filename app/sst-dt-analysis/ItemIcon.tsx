import {
  Box,
  Cog,
  CombineIcon as Conveyor,
  Droplet,
  Filter,
  Forklift,
  Gauge,
  Hammer,
  type LucideIcon,
  LightbulbIcon as LucideProps,
  Pipette,
  PowerIcon as Pump,
  Siren,
  Truck,
} from "lucide-react";

const iconMap: { [key: string]: LucideIcon } = {
  Питател: Truck,
  лента: Conveyor,
  сито: Filter,
  Течка: Droplet,
  Трошачка: Hammer,
  "Маслена станция": Gauge,
  ССТ: Siren,
  ПВ: Pump,
  МБ: Forklift,
  "Захранваща лента": Conveyor,
  Поток: Pipette,
};

export function ItemIcon({ name, ...props }: { name: string }) {
  const Icon =
    Object.entries(iconMap).find(([key]) => name.includes(key))?.[1] || Box;
  return <Icon {...props} />;
}
