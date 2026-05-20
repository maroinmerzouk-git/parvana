import menuData from "@/content/menu.json";

export type MenuTag =
  | "végétarien"
  | "vegan"
  | "épicé"
  | "signature"
  | "fait maison"
  | "soupe";

export interface MenuItem {
  name: string;
  description: string;
  price: string | null;
  tags?: MenuTag[];
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface MenuService {
  active: boolean;
  intro: string;
  formule: string | null;
  categories: MenuCategory[];
}

export interface Menu {
  midi: MenuService;
  soir: MenuService;
}

export function getMenu(): Menu {
  return menuData as Menu;
}
