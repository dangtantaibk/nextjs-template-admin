import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarLinkGroup from "../SidebarLinkGroup";

import { usePathname } from "next/navigation";
import { SubMenuProps } from 'models/sidebar';

interface MenuListProps {
  menu: SubMenuProps;
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const MenuList = (props: MenuListProps) => {
  const { menu, sidebarExpanded, setSidebarExpanded } = props
  const pathname = usePathname();

  return (
    <SidebarLinkGroup
      activeCondition={
        pathname === menu.path || pathname.includes(menu.key)
      }
    >
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <Link
              href="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${(pathname === "/" ||
                pathname.includes(menu.key)) &&
                "bg-graydark dark:bg-meta-4"
                }`}
              onClick={(e) => {
                e.preventDefault();
                sidebarExpanded
                  ? handleClick()
                  : setSidebarExpanded(true);
              }}
            >
              <Image
                width={20}
                height={20}
                src={menu.icon}
                alt={menu.key}
              />
              {menu.title}
              <Image
                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                  }`}
                width={20}
                height={20}
                src={"/admin/images/sidebar/arrow.svg"}
                alt="arrow"
              />
            </Link>
            <div
              className={`translate transform overflow-hidden ${!open && "hidden"
                }`}
            >
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                {menu.children.map((chil, index) => (
                  <li key={index}>
                    <Link
                      href={chil.path}
                      className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/" && "text-white"
                        } `}
                    >
                      {chil.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
};

export default MenuList;
