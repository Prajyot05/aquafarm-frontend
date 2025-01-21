"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { useUserContext } from "@/context/globalProvider";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const { userInfo } = useUserContext();
    const router = useRouter();
    if(userInfo && userInfo.role !== 'ADMIN') return router.replace("/")

  return (
    <>
        {children}
    </>
    )
}