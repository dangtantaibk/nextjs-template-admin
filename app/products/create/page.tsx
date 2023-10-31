"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Link from "next/link";
import moment from "moment";

import { Breadcrumb, Buttons, Loading, Notification, LabelTailwind, UploadFile } from "@/components";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";

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

  return (
    <form onSubmit={onSubmit}>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb pageName="Tạo thông tin sản phẩm" />
      <div className={styles.root}>
        {loading && <div className={styles.loading}><Loading /></div>}
        <div className="p-5">
          <div className={styles.wrapper}>
            <div className={styles.col}>
              <UploadFile
                setNotification={setNotification}
                setUrlFile={setUrlFile}
                urlFile={urlFile || "/admin/images/product/product-01.png"}
                className={styles.uploadfile}
                title="Cập nhập hình ảnh"
                titleBtn="Upload image product"
              />
            </div>
            <div className={styles.col}>
              <LabelTailwind
                title="Tên sản phẩm"
                value={<div className="relative">
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Vui lòng nhập tên sản phẩm',
                    })}
                    placeholder="Tên sản phẩm"
                    className={styles.input}
                  />
                </div>}
                width={150}
              />
              <LabelTailwind
                title="Giá sản phẩm"
                value={<div className="relative">
                  <input
                    type="number"
                    {...register('price', {
                      required: 'Vui lòng nhập giá sản phẩm',
                    })}
                    placeholder="Giá sản phẩm"
                    className={styles.input}
                  />
                </div>}
                width={150}
              />
              <LabelTailwind
                title="Mô tả sản phẩm"
                value={<div className="relative">
                  <textarea
                    rows={4}
                    {...register('description')}
                    placeholder="Mô tả sản phẩm"
                    className={styles.input}
                  />
                </div>}
                width={150}
              />
              <LabelTailwind
                title="SL tồn kho"
                value={<div className="relative">
                  <input
                    type="number"
                    {...register('stock')}
                    placeholder="Số lượng tồn kho"
                    className={styles.input}
                  />
                </div>}
                width={150}
              />
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/products" className={styles.btnLink}>Huỷ</Link>
        <Buttons
          type="primary"
          className={styles.btnSubmit}
          isSubmit={true}
        >
          Cập nhật
        </Buttons>
      </footer>
    </form>
  );
};

const styles = {
  root: 'relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  wrapper: 'grid grid-cols-1 lg:grid-cols-2 gap-4 rounded-sm mb-5',
  col: 'grid grid-cols-1 gap-4',
  uploadfile: 'w-[350px] h-[250px] object-scale-down',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default CreateProductPage;
