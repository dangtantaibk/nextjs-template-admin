import React, { memo, useState } from 'react';
import SignIn from "app/auth/signin/page";
import SignUp from "app/signup/page";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Loader from "@/components/common/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePathname } from 'next/navigation';

interface LayoutProps {
  loading: Boolean;
  isAuth: Boolean;
  children: React.ReactNode;
}

interface AuthComponentProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  children: React.ReactNode;
}

const AuthComponent = (props: AuthComponentProps) => {
  const { sidebarOpen, setSidebarOpen, children } = props;

  return (
    <React.Fragment>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main>
          {/* max-w-screen-2xl */}
          <div className="mx-auto p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
    </React.Fragment>
  )
};

const Layout = (props: LayoutProps) => {
  const { loading, isAuth, children } = props;
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getComponent = () => {
    if (!isAuth) {
      if (pathname === '/admin/signup') {
        return <SignUp />
      }
      return <SignIn />
    }
    return (
      <AuthComponent
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      >
        {children}
      </AuthComponent>)
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> :
            <div className="flex h-screen overflow-hidden">
              <ToastContainer />
              {getComponent()}
            </div>
          }
        </div>
      </body>
    </html>
  );
};

export default memo(Layout);
