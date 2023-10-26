import React from "react";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { SubMenuProps } from 'models/sidebar';

interface MenuProps {
  menu: SubMenuProps;
}

const MenuItem = (props: MenuProps) => {
  const { menu } = props
  const pathname = usePathname();

  return (
    <li>
      <Link
        href={menu.path}
        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes(menu.key) &&
          "bg-graydark dark:bg-meta-4"
          }`}
      >
        <Image
          width={20}
          height={20}
          src={menu.icon}
          alt={menu.key}
        />
        {menu.title}
      </Link>
    </li>
  )
};

export default MenuItem;
