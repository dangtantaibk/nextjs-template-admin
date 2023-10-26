"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import Loading from 'components/Loading';
import Notification from "@/components/Notification";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { AUTH_DOMAIN } from 'constant';

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[120px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
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

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
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
  })

  const uploadAvatarUser = async (file) => {
    const TYPE_IMAGE = ['image/png', 'image/jpeg', 'image/gif'];
    const formData = new FormData();
    const token = await localStorage.getItem('auth');
    if (!TYPE_IMAGE.includes(file.type)) {
      setNotification({ isOpen: true, message: "Vui lòng chọn file ảnh *png, *jpeg, *gif", type: "error" })
    } else {
      formData.append('file', file);
      await fetch(`https://${AUTH_DOMAIN[location.host]}api/v1/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          try {
            if (data.data) {
              setUrlFile(data.data.url)
              setNotification({ isOpen: true, message: "Upload file thành công", type: "success" })
            } else {
              setNotification({ isOpen: true, message: data.message, type: "error" })
            }
          } catch (error) {
            console.log(error)
          }
        })
        .catch(error => {
          console.error('Upload failed:', error);
        });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb parent="Thông tin nhân viên" pageName="Thêm nhân viên" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 rounded-sm mb-5 ">
            <Item
              title="Tên nhân viên"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('username', {
                    required: 'Vui lòng nhập tên nhân viên',
                  })}
                  placeholder="Tên nhân viên"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item
              title="Tên đăng nhập"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('name', {
                    required: 'Vui lòng nhập tên đăng nhập',
                  })}
                  placeholder="Tên đăng nhập"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item
              title="Chức vụ"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Chức vụ"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item
              title="Password"
              value={<div className="relative">
                <input
                  type={!locked ? "password" : "text"}
                  {...register('password', {
                    required: 'Vui lòng nhập password',
                  })}
                  placeholder="Mật khẩu"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
            <Item
              title="Hình ảnh nhân viên"
              value={<div className="xsm:bottom-4 xsm:right-4">
                <label
                  htmlFor="cover"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                >
                  <input
                    type="file"
                    name="cover"
                    id="cover"
                    className="sr-only"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={(e: any) => {
                      e.preventDefault();
                      const file = e?.target?.files[0];
                      uploadAvatarUser(file)
                    }} />
                  <span>
                    <img src="/admin/images/user/ic-camera.svg" alt="ic_camera" className="fill-current" />
                  </span>
                  <span>Avatar</span>
                </label>
              </div>}
            />
            {!!urlFile && <img src={urlFile} alt="file" className="w-[300px] h-[200px]" />}
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/users" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
          Huỷ
        </Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className="!bg-success hover:!bg-stroke">
          Tạo nhân viên
        </Buttons>
      </footer>
    </form>
  );
};

export default CreateUserPage;
