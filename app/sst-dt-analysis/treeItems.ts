export interface TreeItem {
  name: string;
  children?: TreeItem[];
}

const commonChildrenForPotok1To4: TreeItem[] = [
  { name: "Питател 1" },
  { name: "Питател 2" },
  { name: "Питател 3" },
  { name: "Питател 4" },
  { name: "Питател 5" },
  { name: "Питател 6" },
  { name: "Дълга лента" },
  { name: "Горно сито" },
  { name: "Къса лента" },
  { name: "Течка" },
  { name: "Трошачка" },
  { name: "Долно сито" },
  { name: "Маслена станция" },
  { name: "ССТ 5" },
  { name: "ПВ 1" },
  { name: "ПВ 2/3" },
  { name: "ССТ 7" },
  { name: "ССТ 8" },
  { name: "ССТ 9" },
  { name: "МБ 1" },
  { name: "МБ 2" },
];

const commonChildrenForPotok5To13: TreeItem[] = [
  { name: "Захранваща лента" },
  { name: "Течка" },
  { name: "Трошачка" },
  { name: "Сито" },
  { name: "Маслена станция" },
  { name: "ССТ 6" },
  { name: "ПВ 1" },
  { name: "ПВ 2/3" },
  { name: "ССТ 7" },
  { name: "ССТ 8" },
  { name: "ССТ 9" },
  { name: "МБ 1" },
  { name: "МБ 2" },
];

export const treeItems: TreeItem[] = [
  { name: "Поток 1", children: commonChildrenForPotok1To4 },
  { name: "Поток 2", children: commonChildrenForPotok1To4 },
  { name: "Поток 3", children: commonChildrenForPotok1To4 },
  { name: "Поток 4", children: commonChildrenForPotok1To4 },
  { name: "Поток 5", children: commonChildrenForPotok5To13 },
  { name: "Поток 6", children: commonChildrenForPotok5To13 },
  { name: "Поток 7", children: commonChildrenForPotok5To13 },
  { name: "Поток 8", children: commonChildrenForPotok5To13 },
  { name: "Поток 9", children: commonChildrenForPotok5To13 },
  { name: "Поток 10", children: commonChildrenForPotok5To13 },
  { name: "Поток 11", children: commonChildrenForPotok5To13 },
  { name: "Поток 12", children: commonChildrenForPotok5To13 },
  { name: "Поток 13", children: commonChildrenForPotok5To13 },
];
