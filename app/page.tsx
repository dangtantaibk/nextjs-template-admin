import { Metadata } from "next";
import ECommerce from "@/components/Dashboard/E-commerce";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ trang admin",
};

export default function Home() {
  return (
    <ECommerce />
  );
}
