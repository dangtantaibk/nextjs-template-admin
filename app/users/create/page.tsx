"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Link from "next/link";
import Image from "next/image";

import { Breadcrumb, Buttons, Loading, Notification, LabelTailwind, UploadFile } from "@/components";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";

const notiDetail = {
  isOpen: false,
  message: "",
  type: ""
}

const CreateUserPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const router = useRouter();

  const [locked, setLocked] = useState(false);
  const [loading, setloading] = useState(false);
  const [urlFile, setUrlFile] = useState("");
  const [notification, setNotification] = useState(notiDetail);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = { ...data, avatar: urlFile }
    const resp = await request.post(`/api/v1/users`, params);
    try {
      if (resp.status === 201) {
        router.push("/users")
        setNotification({ isOpen: true, message: "Tạo nhân viên thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Tạo nhân viên thất bại", type: "error" })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb parent="Thông tin nhân viên" pageName="Thêm nhân viên" />
      <div className={styles.root}>
        {loading && <div className={styles.loading}><Loading /></div>}
        <div className="p-5">
          <div className={styles.col}>
            <LabelTailwind
              title="Tên nhân viên"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('username', {
                    required: 'Vui lòng nhập tên nhân viên',
                  })}
                  placeholder="Tên nhân viên"
                  className={styles.input}
                />
              </div>}
            />
            <LabelTailwind
              title="Tên đăng nhập"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('name', {
                    required: 'Vui lòng nhập tên đăng nhập',
                  })}
                  placeholder="Tên đăng nhập"
                  className={styles.input}
                />
              </div>}
            />
            <LabelTailwind
              title="Chức vụ"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Chức vụ"
                  className={styles.input}
                />
              </div>}
            />
            <LabelTailwind
              title="Password"
              value={<div className="relative">
                <input
                  type={!locked ? "password" : "text"}
                  {...register('password', {
                    required: 'Vui lòng nhập password',
                  })}
                  placeholder="Mật khẩu"
                  className={styles.input}
                />
                <span className="absolute right-4 top-2" onClick={() => {
                  setLocked(!locked);
                }}>
                  <Image
                    src={`/admin/images/signin/${!locked ? 'pass' : 'lockOpen'}.svg`}
                    alt="login"
                    width={24}
                    height={24}
                  />
                </span>
              </div>}
            />
            <UploadFile
              setNotification={setNotification}
              setUrlFile={setUrlFile}
              urlFile={urlFile}
              className={styles.uploadfile}
              title="Hình ảnh nhân viên"
              titleBtn="Avatar"
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/users" className={styles.btnLink}>Huỷ</Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className={styles.btnSubmit}>
          Tạo nhân viên
        </Buttons>
      </footer>
    </form>
  );
};

const styles = {
  root: 'relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  col: 'grid grid-cols-1 gap-5 rounded-sm mb-4',
  uploadfile: 'w-[300px] h-[200px]',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default CreateUserPage;
