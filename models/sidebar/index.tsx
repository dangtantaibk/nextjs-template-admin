export interface ChildrenSubMenuProps {
  title: string;
  path: string;
}

export interface SubMenuProps {
  icon: string;
  key: string;
  title: string;
  path: string;
  children: ChildrenSubMenuProps[];
}

export interface MenuProps {
  title: string;
  submenu: SubMenuProps[];
}

export interface SidebarProps {
  menu: MenuProps[];
}