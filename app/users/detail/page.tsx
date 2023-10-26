"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import moment from "moment";
import Loading from 'components/Loading';
import Notification from "@/components/Notification";

import { useRouter } from 'next/navigation';

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center">
      <div className="font-semibold mr-2 min-w-[120px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}

interface BlogsDetailProp {
  author: number;
  content: string | null;
  createdAt: number;
  id: number;
  publishedDate: number;
  shortDesc: string;
  status: number;
  title: string;
  updatedAt: number;
  url?: string;
}

const UserDetailPage = () => {
  let id = new URLSearchParams(location.search).get('id');
  const router = useRouter();
  const [blogDetail, setBlogDetail] = useState<BlogsDetailProp>()
  const [loading, setloading] = useState(false);
  const [content, setContent] = useState<any>();
  const [contentAdmin, setContentAdmin] = useState<any>({});
  const [url, setUrl] = useState("");
  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const getBlog = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/blogs/${id}`);
    try {
      console.log("resp", resp)
      if (resp.data) {
        const data = resp.data;
        const contentAdmin = JSON.parse(data.contentAdmin);
        setContentAdmin(contentAdmin);
        setBlogDetail(data);
        setUrl(data.url);
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
    getBlog(id);
  }, [id]);

  const handleUpdate = async () => {
    const params = {
      ...blogDetail, content: content,
      url: url,
      contentAdmin: JSON.stringify(contentAdmin)
    }
    const resp = await request.put(`/api/v1/blogs/${id}`, params);
    try {
      if (resp.status === 204) {
        setNotification({ isOpen: true, message: "Chỉnh sửa nội dung thành công", type: "success" })
        getBlog(id);
      } else {
        setNotification({ isOpen: true, message: "Chỉnh sửa nội dung thất bại", type: "error" })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <React.Fragment>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb parent="Thông tin nhân viên" pageName="Thông tin chi tiết" />
      <div className="relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-sm mb-5">
            <Item title="Mã tin tức" value={blogDetail ? blogDetail.id : '-'} />
            <Item title="Tên tin tức" value={blogDetail ? blogDetail.title : '-'} />
            <Item title="Thời gian tạo" value={(blogDetail && blogDetail.createdAt) ? moment(blogDetail.createdAt).format('DD/MM/YYYY') : '-'} />
            <Item title="Link tin tức" value={<input
              type="text"
              defaultValue={url}
              onChange={(e) => {
                e.preventDefault();
                const value = e.target.value;
                setUrl(value);
              }}
              placeholder="Link tin tức"
              className="w-full min-w-[350px] rounded-lg border border-stroke bg-transparent p-2 outline-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />} />
          </div>
          <div className="font-semibold mr-2 mb-5 border-b border-stroke">Nội dung: </div>
          <div className="w-full">
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Buttons
          type="primary"
          className="!bg-meta-8 mr-3 hover:!bg-stroke"
          onClick={() => {
            router.push("/blogs/list")
          }}>
          Huỷ
        </Buttons>
        <Buttons
          type="primary"
          className="!bg-success hover:!bg-stroke"
          onClick={() => {
            handleUpdate()
          }}>
          Cập nhật
        </Buttons>
      </footer>
    </React.Fragment>
  );
};

export default UserDetailPage;
