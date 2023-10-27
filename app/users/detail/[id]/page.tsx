"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import Loading from 'components/Loading';
import Link from "next/link";
import Notification from "@/components/Notification";

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { AUTH_DOMAIN } from 'constant';
import useLocalStorage from "@/hooks/useLocalStorage";

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[120px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}
interface UserDetail {
  avatar: string | null;
  id: number;
  name: string | null;
  password: string;
  title: string | null;
  username: string;
}

const UserDetailPage = ({ params }: { params: { id: string } }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const router = useRouter();
  const id = params.id;
  const [userDetail, setUserDetail] = useState<UserDetail>();
  const [loading, setloading] = useState(false);
  const [urlFile, setUrlFile] = useState("");
  const [token, setToken] = useLocalStorage("auth", "");

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const getUserDetail = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/users/${id}`);
    try {
      if (resp.data) {
        const user = resp.data;
        setUserDetail(user)
        setValue("title", user.title || '');
        setValue("name", user.name || "");
        setValue("username", user.username || '');
        setUrlFile(user.avatar)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    if (!id) {
      router.refresh();
      return;
    }
    getUserDetail(id);
  }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = { ...userDetail, ...data, avatar: urlFile }
    const resp = await request.put(`/api/v1/users/${id}`, params);

    try {
      if (resp.status === 201) {
        router.push("/users")
        setNotification({ isOpen: true, message: "Cập nhật thông tin nhân viên thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Cập nhật thông tin nhân viên thất bại", type: "error" })
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
    if (!TYPE_IMAGE.includes(file.type)) {
      setNotification({ isOpen: true, message: "Vui lòng chọn file ảnh *png, *jpeg, *gif", type: "error" })
    } else {
      formData.append('file', file);
      await fetch(`${AUTH_DOMAIN}api/v1/upload`, {
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
      <Breadcrumb parent="Thông tin nhân viên" pageName="Thông tin chi tiết" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-sm mb-5">
            <div className="grid grid-cols-1 gap-4">
              <img src={urlFile || userDetail?.avatar || '/admin/images/user/user-06.png'} alt="file" className="w-[200px] h-[200px] object-scale-down rounded-full border" />
              <Item
                title="Cập nhập hình ảnh"
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
                    <span>Upload avatar</span>
                  </label>
                </div>}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Item
                title="Mã nhân viên"
                value={<div>{userDetail?.id || "-"}</div>}
              />

              <Item
                title="Tên đăng nhập"
                value={<div className="relative">
                  <input
                    type="text"
                    disabled
                    {...register('username', {
                      required: 'Vui lòng nhập tên đăng nhập',
                    })}
                    placeholder="Tên đăng nhập"
                    className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary bg-bodydark"
                  />
                </div>}
              />
              <Item
                title="Tên nhân viên"
                value={<div className="relative">
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Vui lòng nhập tên nhân viên',
                    })}
                    placeholder="Tên nhân viên"
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
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/users" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
          Huỷ
        </Link>
        <Buttons
          type="primary"
          className="!bg-success hover:!bg-stroke"
          isSubmit={true}
        >
          Cập nhật
        </Buttons>
      </footer>
    </form>
  );
};

export default UserDetailPage;
