"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import EditorNovel from '../detail/EditorNovel';
import moment from "moment";
import Loading from 'components/Loading';
import Link from "next/link";
import Image from "next/image";
import Notification from "@/components/Notification";

import { AUTH_DOMAIN } from 'constant';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[120px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}

const BlogsDetailPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [content, setContent] = useState<any>();
  const [contentAdmin, setContentAdmin] = useState<any>({});
  const [urlFile, setUrlFile] = useState("");
  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }

  let token: any;

  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("auth");
  }

  const [notification, setNotification] = useState(notiDetail);

  const handleUpdateEditor = (content, view) => {
    setContentAdmin(view);
    setContent(content)
  }

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = {
      ...data,
      updatedAt: moment().valueOf(),
      content: content,
      backgroundUrl: urlFile,
      contentAdmin: JSON.stringify(contentAdmin)
    }
    const resp = await request.post(`/api/v1/blogs`, params);
    try {
      router.push("/blogs/list")
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  });

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
      <Breadcrumb parent="Tin tức" pageName="Thêm tin tức" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 rounded-sm mb-5 ">
            <Item
              title="Tiêu đề"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Tiêu đề"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item title="Link tin tức" value={<div className="relative">
              <input
                type="text"
                {...register('url')}
                placeholder="/example"
                className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>} />
            <Item title="Mô tả ngắn" value={<div className="relative">
              <textarea
                rows={4}
                {...register('shortDesc')}
                placeholder="Mô tả ngắn"
                className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>} />
            {(urlFile) &&
              <img src={urlFile || ""} alt="image" className="w-[350px] h-[200px] object-contain " />
            }
            <Item
              title="Cập nhập hình nền"
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
                    <Image src="/admin/images/user/ic-camera.svg" alt="ic_camera" width={19} height={19} className="fill-current" />
                  </span>
                  <span>Upload</span>
                </label>
              </div>}
            />
          </div>
          <div className="font-semibold mr-2 mb-5 border-b border-stroke">Mô tả: </div>
          <div className="w-full">
            <EditorNovel handleUpdateEditor={handleUpdateEditor} />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/blogs/list" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
          Huỷ
        </Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className="!bg-success hover:!bg-stroke">
          Thêm tin tức
        </Buttons>
      </footer>
    </form>
  );
};

export default BlogsDetailPage;
