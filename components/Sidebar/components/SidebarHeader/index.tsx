import React from "react";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  trigger: any;
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SidebarHeader = (props: SidebarProps) => {
  const { trigger, sidebarOpen, setSidebarOpen } = props;

  return (
    <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
      <Link href="/">
        <Image
          width={176}
          height={32}
          src={"/admin/images/logo/logo.svg"}
          alt="Logo"
        />
      </Link>
      <button
        ref={trigger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
        className="block lg:hidden"
      >
        <Image
          width={20}
          height={20}
          src={"/admin/images/sidebar/back.svg"}
          alt="back"
        />
      </button>
    </div>
  );
};

export default SidebarHeader;
