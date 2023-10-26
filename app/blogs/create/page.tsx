"use client"
import React, { useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import EditorNovel from '../detail/EditorNovel';
import moment from "moment";
import Loading from 'components/Loading';
import Link from "next/link";

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
  })

  return (
    <form onSubmit={onSubmit}>
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
