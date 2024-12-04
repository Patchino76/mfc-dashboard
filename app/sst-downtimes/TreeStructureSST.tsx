import { Tree } from "@/components/ui/tree";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cog,
  Container,
  Factory,
  Filter,
  Gauge,
  HardDrive,
  Loader2,
  Power,
  Rocket,
  Settings,
  Truck,
  Wrench,
} from "lucide-react";
import React from "react";

interface TreeStructureSSTProps {
  onSelect?: (id: string) => void;
}

const TreeStructureSST = ({ onSelect }: TreeStructureSSTProps) => {
  const [selectedId, setSelectedId] = React.useState<string>("");

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect?.(id);
  };

  const treeItems = [
    {
      id: "1",
      name: "Оборудване",
      icon: <Factory className="h-4 w-4 text-blue-600" />,
      children: [
        {
          id: "2",
          name: "Първично трошене",
          icon: <Cog className="h-4 w-4 text-red-500" />,
          children: [
            {
              id: "3",
              name: "Челюстна трошачка C160",
              icon: <Settings className="h-4 w-4 text-red-400" />,
              children: [
                {
                  id: "4",
                  name: "Задвижваща система",
                  icon: <Power className="h-4 w-4 text-yellow-500" />,
                },
                {
                  id: "5",
                  name: "Хидравлика",
                  icon: <Gauge className="h-4 w-4 text-green-500" />,
                },
              ],
            },
            {
              id: "6",
              name: "Жирационна трошачка KB63-89",
              icon: <Settings className="h-4 w-4 text-red-400" />,
            },
          ],
        },
        {
          id: "7",
          name: "Вторична обработка",
          icon: <Cog className="h-4 w-4 text-orange-500" />,
          children: [
            {
              id: "8",
              name: "Конусни трошачки",
              icon: <Loader2 className="h-4 w-4 text-orange-400" />,
              children: [
                {
                  id: "9",
                  name: "Трошачка HP400",
                  icon: <Settings className="h-4 w-4 text-orange-400" />,
                },
                {
                  id: "10",
                  name: "Трошачка MP1000",
                  icon: <Settings className="h-4 w-4 text-orange-400" />,
                },
              ],
            },
          ],
        },
        {
          id: "11",
          name: "Обработка на материали",
          icon: <Truck className="h-4 w-4 text-purple-500" />,
          children: [
            {
              id: "12",
              name: "Транспортни системи",
              icon: <HardDrive className="h-4 w-4 text-purple-400" />,
              children: [
                {
                  id: "13",
                  name: "Основна захранваща лента BC-101",
                  icon: <Rocket className="h-4 w-4 text-purple-400" />,
                },
                {
                  id: "14",
                  name: "Трансферна лента BC-102",
                  icon: <Rocket className="h-4 w-4 text-purple-400" />,
                },
                {
                  id: "15",
                  name: "Складова лента BC-103",
                  icon: <Rocket className="h-4 w-4 text-purple-400" />,
                },
              ],
            },
          ],
        },
        {
          id: "16",
          name: "Пресевни системи",
          icon: <Filter className="h-4 w-4 text-green-500" />,
          children: [
            {
              id: "17",
              name: "Първични сита",
              icon: <Container className="h-4 w-4 text-green-400" />,
              children: [
                {
                  id: "18",
                  name: "Вибрационно сито VS-201",
                  icon: <Wrench className="h-4 w-4 text-green-400" />,
                },
                {
                  id: "19",
                  name: "Вибрационно сито VS-202",
                  icon: <Wrench className="h-4 w-4 text-green-400" />,
                },
              ],
            },
            {
              id: "20",
              name: "Вторични сита",
              icon: <Container className="h-4 w-4 text-green-400" />,
              children: [
                {
                  id: "21",
                  name: "Многопалубно сито MD-301",
                  icon: <Wrench className="h-4 w-4 text-green-400" />,
                },
                {
                  id: "22",
                  name: "Многопалубно сито MD-302",
                  icon: <Wrench className="h-4 w-4 text-green-400" />,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Цех ССТ</CardTitle>
        <CardDescription>Йерархия на машини</CardDescription>
      </CardHeader>
      <CardContent>
        <Tree 
          items={treeItems} 
          className="p-1" 
          defaultExpanded={false}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </CardContent>
    </Card>
  );
};

export default TreeStructureSST;
