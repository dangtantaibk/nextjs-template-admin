"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Link from "next/link";

import { Breadcrumb, Buttons, Loading, Notification, LabelTailwind } from "@/components";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";

const CreateCategoryBlogsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();
  const router = useRouter();
  const [loading, setloading] = useState(false);

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const resp = await request.post(`/api/v1/categoryBlogs`, data);

    try {
      if (resp.status === 201) {
        router.push("/category-blogs")
        setNotification({ isOpen: true, message: "Tạo danh mục thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Tạo danh mục thất bại", type: "error" })
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
      <Breadcrumb pageName="Thêm danh mục" />
      <div className={styles.root}>
        {loading && <div className={styles.loading}><Loading /></div>}
        <div className="p-5">
          <div className={styles.col}>
            <LabelTailwind
              title="Tên danh mục"
              value={<div className="relative">
                <input
                  type="text"
                  {...register('name', {
                    required: 'Vui lòng nhập tên danh mục',
                  })}
                  placeholder="Tên danh mục"
                  className={styles.input}
                />
              </div>}
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/category-blogs" className={styles.btnLink}>Huỷ</Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className={styles.btnSubmit}>
          Tạo danh mục
        </Buttons>
      </footer>
    </form>
  );
};

const styles = {
  root: 'relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  col: 'grid grid-cols-1 gap-4 rounded-sm mb-5',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default CreateCategoryBlogsPage;
