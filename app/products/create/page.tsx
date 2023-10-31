"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs";
import Buttons from "@/components/Buttons";
import Loading from 'components/Loading';
import Link from "next/link";
import Notification from "@/components/Notification";
import moment from "moment";
import Image from "next/image";

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { AUTH_DOMAIN } from 'constant';

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[125px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}

const CreateProductPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [urlFile, setUrlFile] = useState("");

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);
  let token: any;

  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("auth");
  }

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = { ...data, image: urlFile, updatedAt: moment().valueOf(), createdAt: moment().valueOf() }
    const resp = await request.post(`/api/v1/products`, params);
    try {
      if (resp.status === 201) {
        router.push("/products")
        setNotification({ isOpen: true, message: "Tạo sản phẩm thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Tạo sản phẩm thất bại", type: "error" })
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
      <Breadcrumb pageName="Tạo thông tin sản phẩm" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-sm mb-5">
            <div className="grid grid-cols-1 gap-4">
              <Image
                src={urlFile || '/admin/images/product/product-01.png'}
                alt="file"
                width={350}
                height={250}
                className="object-scale-down" />
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
                      <Image
                        src="/admin/images/user/ic-camera.svg"
                        alt="ic_camera"
                        width={19}
                        height={19}
                        className="fill-current" />
                    </span>
                    <span>Upload image product</span>
                  </label>
                </div>}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Item
                title="Tên sản phẩm"
                value={<div className="relative">
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Vui lòng nhập tên sản phẩm',
                    })}
                    placeholder="Tên sản phẩm"
                    className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primar"
                  />
                </div>}
              />
              <Item
                title="Giá sản phẩm"
                value={<div className="relative">
                  <input
                    type="number"
                    {...register('price', {
                      required: 'Vui lòng nhập giá sản phẩm',
                    })}
                    placeholder="Giá sản phẩm"
                    className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>}
              />

              <Item
                title="Mô tả sản phẩm"
                value={<div className="relative">
                  <textarea
                    rows={4}
                    {...register('description')}
                    placeholder="Mô tả sản phẩm"
                    className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>}
              />
              <Item
                title="SL tồn kho"
                value={<div className="relative">
                  <input
                    type="number"
                    {...register('stock')}
                    placeholder="Số lượng tồn kho"
                    className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>}
              />
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/products" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
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

export default CreateProductPage;
