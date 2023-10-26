import React from "react";
import MenuList from "../MenuList";
import MenuItem from '../MenuItem';
import { SidebarProps } from 'models/sidebar';

interface MenuSidebarProps {
  menus: SidebarProps;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const MenuSidebar = (props: MenuSidebarProps) => {
  const { menus, sidebarExpanded, setSidebarExpanded } = props

  return (
    <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        {menus.menu.map((item, index) => (
          <div key={index}>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              {item.title}
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {item.submenu.map((element, indx) => {
                if (element.children.length > 0) {
                  return (
                    <MenuList
                      key={indx}
                      menu={element}
                      sidebarExpanded={sidebarExpanded}
                      setSidebarExpanded={setSidebarExpanded} />)
                }
                return (<MenuItem key={indx} menu={element} />)
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MenuSidebar;
