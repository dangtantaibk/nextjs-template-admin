"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import moment from "moment";
import Link from "next/link";

import { Breadcrumb, Buttons, EditorNovelTailwind, UploadFile, LabelTailwind, Notification, Loading } from "@/components";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const notiDetail = {
  isOpen: false,
  message: "",
  type: ""
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
  const [contentPreAdmin, setContentPreAdmin] = useState<any>({});
  const [urlFile, setUrlFile] = useState("");
  const [notification, setNotification] = useState(notiDetail);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = {
      ...data,
      updatedAt: moment().valueOf(),
      content: content,
      backgroundUrl: urlFile,
      contentAdmin: JSON.stringify(contentAdmin)
    }
    await request.post(`/api/v1/blogs`, params);
    try {
      router.push("/blogs/list")
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
      <Breadcrumb parent="Tin tức" pageName="Thêm tin tức" />
      <div className={styles.root_bg}>
        {loading &&
          <div className={styles.loading}><Loading /></div>
        }
        <div className="p-5">
          <div className={styles.wrapper}>
            <LabelTailwind title="Tiêu đề" value={<div className="relative">
              <input
                type="text"
                {...register('title')}
                placeholder="Tiêu đề"
                className={styles.input}
              />
            </div>}
            />
            <LabelTailwind title="Link tin tức" value={<div className="relative">
              <input
                type="text"
                {...register('url')}
                placeholder="/example"
                className={styles.input}
              />
            </div>} />
            <LabelTailwind title="Mô tả ngắn" value={<div className="relative">
              <textarea
                rows={4}
                {...register('shortDesc')}
                placeholder="Mô tả ngắn"
                className={styles.input}
              />
            </div>} />
            <UploadFile
              setNotification={setNotification}
              setUrlFile={setUrlFile}
              urlFile={urlFile || ""}
              className="w-[350px] h-[200px] object-contain"
              title="Cập nhập hình nền"
            />
          </div>
          <EditorNovelTailwind
            setContent={setContent}
            contentAdmin={contentAdmin}
            setContentAdmin={setContentAdmin}
            contentPreAdmin={contentPreAdmin}
            setContentPreAdmin={setContentPreAdmin}
            setNotification={setNotification}
          />
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/blogs/list" className={styles.btnLink}>Huỷ</Link>
        <Buttons
          type="primary"
          isSubmit={true}
          className={styles.btnSubmit}>
          Thêm tin tức
        </Buttons>
      </footer>
    </form>
  );
};

const styles = {
  root_bg: 'relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  wrapper: 'grid grid-cols-1 gap-4 rounded-sm mb-5',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default BlogsDetailPage;
