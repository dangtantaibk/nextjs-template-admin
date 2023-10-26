import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";
import request from '@/utils/request';

interface UserDetail {
  avatar: string | null;
  id: number;
  name: string | null;
  password: string;
  title: string | null;
  username: string;
}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail>();

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const router = useRouter();

  const getUserDetail = async () => {
    const resp: any = await request(`api/v1/users`);
    setUserDetail(resp?.data?.content[0])
  }

  console.log("userDetail", userDetail)

  useEffect(() => {
    getUserDetail();
  }, [])
  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white uppercase">
            {userDetail?.username}
          </span>
          <span className="block text-xs">Quản trị viên</span>
        </span>
        <span className="h-12 w-12 rounded-full">
          <img
            src={userDetail?.avatar || '/admin/images/user/user-06.png'}
            alt="avatar"
            className="rounded-full object-cover w-[50px] h-[50px]" />
        </span>
        <img
          src={'/admin/images/user/arrow-down.svg'}
          alt="arrow-down" />
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? "block" : "hidden"
          }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <img
                src={'/admin/images/user/user.svg'}
                className="fill-current"
                alt="user" />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <img
                src={'/admin/images/user/contact.svg'}
                className="fill-current"
                alt="contact" />
              My Contacts
            </Link>
          </li>
          <li>
            <Link
              href="/pages/settings"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <img
                src={'/admin/images/user/setting.svg'}
                className="fill-current"
                alt="contact" />
              Account Settings
            </Link>
          </li>
        </ul>
        <button onClick={() => {
          localStorage.removeItem("auth")
          router.refresh();
        }} className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base">
          <img
            src={'/admin/images/user/log-out.svg'}
            className="fill-current"
            alt="contact" />

          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;
