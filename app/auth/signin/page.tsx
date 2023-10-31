"use client";
import React, { useState } from "react";
import Notification from "@/components/Notification";
import Loading from "@/components/Loading";
import Link from "next/link";
import Image from "next/image";
import request from '@/utils/request';

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormValues = {
  username: string
  password: string
}

type TextError = {
  value: string | undefined;
}

const TextError = (props: TextError) => {
  return <p style={{ color: 'red', fontSize: 13 }}>{props.value}</p>
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const router = useRouter();
  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [loadding, setLoadding] = useState(false);
  const [notification, setNotification] = useState(notiDetail);
  const [locked, setLocked] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoadding(true);
    const resp: any = await request.post(`/api/v1/users/login`, data);
    console.log("resp=======>", resp)
    try {
      if (resp?.data?.jwt) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem('auth', resp?.data?.jwt);
        }
        setNotification({ isOpen: true, message: "Đăng nhập thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Đăng nhập thất bại", type: "error" })
      }
      router.refresh();
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoadding(false);
    }
  })

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full h-full">
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      {loadding &&
        <div className="absolute z-9999 h-full flex items-center justify-center w-full bg-boxdark-30">
          <Loading />
        </div>
      }
      <div className="flex items-center justify-center w-full sm:p-20 h-full">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <span className="mt-15 inline-block">
              <Image
                src={"/admin/images/signin/login.svg"}
                alt="login"
                width={350}
                height={350}
              />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Đăng nhập
            </h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('username', {
                      required: 'Vui lòng nhập tên đăng nhập',
                    })}
                    placeholder="Tên đăng nhập"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4">
                    <Image
                      src={"/admin/images/signin/user.svg"}
                      alt="login"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                {errors.username && <TextError value={errors.username.message} />}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={!locked ? "password" : "text"}
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải ít nhất 6 ký tự trở lên',
                      },
                    })}
                    placeholder="Mật khẩu"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4" onClick={() => {
                    setLocked(!locked);
                  }}>
                    <Image
                      src={`/admin/images/signin/${!locked ? 'pass' : 'lockOpen'}.svg`}
                      alt="login"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                {errors.password && <TextError value={errors.password.message} />}
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Đăng nhập"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-6 text-center">
                <p>
                  Bạn chưa có account?{" "}
                  <Link href="/signup" className="text-primary">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
