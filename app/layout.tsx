"use client";
import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";

import { useRouter } from 'next/navigation';

interface RootLayout {
  children: React.ReactNode;
}

const RootLayout = (props: RootLayout) => {
  const { children } = props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  let isAuth = !!localStorage.getItem("auth");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      router.push("/")
    }
  }, [isAuth])

  return (
    <Layout loading={loading} isAuth={isAuth}>{children}</Layout>
  );
}

export default RootLayout;
