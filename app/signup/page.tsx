"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import request from '@/utils/request';
import { useForm } from "react-hook-form"

type FormValues = {
  username: string;
  password: string;
  rePassword: string;
}

type TextError = {
  value: string | undefined;
}

const TextError = (props: TextError) => {
  return <p style={{ color: 'red', fontSize: 13 }}>{props.value}</p>
}

const SignUp: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [pass, setPass] = useState(false);

  const [rePass, setRePass] = useState(false);

  const registerUser = async (data) => {
    const resp = await request('api/v1/users/login', {
      method: 'POST',
      data: data,
      requestType: 'json',
    });
    if (resp) { }
  }

  const onSubmit = handleSubmit((data) => {
    console.log("data", data)
    registerUser(data)
  })

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark w-full">
      <div className="flex flex-wrap items-center sm:p-20 sm:mt-12.5">
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
              Đăng ký
            </h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Tên đăng ký
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('username', {
                      required: 'Vui lòng nhập tên'
                    })}
                    placeholder="Tên đăng ký"
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
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={!pass ? "password" : "text"}
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu',
                    })}
                    placeholder="Mật khẩu"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4" onClick={() => {
                    setPass(!pass);
                  }}>
                    <Image
                      src={`/admin/images/signin/${!pass ? 'pass' : 'lockOpen'}.svg`}
                      alt="login"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={!rePass ? "password" : "text"}
                    {...register('rePassword', {
                      required: 'Vui lòng nhập lại mật khẩu',
                    })}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <span className="absolute right-4 top-4" onClick={() => {
                    setRePass(!rePass);
                  }}>
                    <Image
                      src={`/admin/images/signin/${!rePass ? 'pass' : 'lockOpen'}.svg`}
                      alt="login"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Tạo tài khoản"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              <div className="mt-6 text-center">
                <p>
                  Tài khoản đã tồn tại?{" "}
                  <Link href="/" className="text-primary">
                    Đăng nhập
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

export default SignUp;
