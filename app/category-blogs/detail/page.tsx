"use client"
import React, { useState, useEffect } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import Loading from 'components/Loading';
import Notification from "@/components/Notification";
import Link from "next/link";

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[120px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}

interface CategoryDetail {
  id: number;
  name: string;
}

const CategoryBlogsDetailPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  let id = new URLSearchParams(location.search).get('id');

  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [categoryDetail, setCategoryDetail] = useState<CategoryDetail>();

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const getCategoryBlogsDetail = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/categoryBlogs/${id}`);
    try {
      if (resp.data) {
        const category = resp.data;
        setCategoryDetail(category);
        setValue("name", category.name || '');
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
    getCategoryBlogsDetail(id);
  }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = {...categoryDetail, ...data}
    const resp = await request.put(`/api/v1/categoryBlogs/${id}`, params);

    try {
      if (resp.status === 204) {
        router.push("/category-blogs")
        setNotification({ isOpen: true, message: "Cập nhật danh mục thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Cập nhật danh mục thất bại", type: "error" })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  })

  return (
    <form onSubmit={onSubmit}>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb pageName="Thông tin chi tiết danh mục" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 rounded-sm mb-5 ">
            <Item
              title="Tên danh mục"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('name', {
                    required: 'Vui lòng nhập tên danh mục',
                  })}
                  placeholder="Tên danh mục"
                  className="w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/category-blogs" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
          Huỷ
        </Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className="!bg-success hover:!bg-stroke">
          Cập nhật
        </Buttons>
      </footer>
    </form>
  );
};

export default CategoryBlogsDetailPage;
