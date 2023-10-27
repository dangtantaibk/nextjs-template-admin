"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import EditorNovelDefault from "./EditorNovelDefault";
import EditorNovel from './EditorNovel';
import moment from "moment";
import Loading from 'components/Loading';
import Notification from "@/components/Notification";

import { useRouter } from 'next/navigation';
import { AUTH_DOMAIN } from 'constant';
// import EditorConfig from "@/components/EditorConfig";

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
  backgroundUrl?: string | null;
}

const BlogsDetailPage = () => {
  let id = new URLSearchParams(location.search).get('id');
  const router = useRouter();
  const [blogDetail, setBlogDetail] = useState<BlogsDetailProp>()
  const [loading, setloading] = useState(false);
  const [content, setContent] = useState<any>();
  const [contentAdmin, setContentAdmin] = useState<any>({});
  const [url, setUrl] = useState("");
  const [urlFile, setUrlFile] = useState("");
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
      if (resp.data) {
        const data = resp.data;
        const contentAdmin = JSON.parse(data.contentAdmin);
        setContentAdmin(contentAdmin);
        setBlogDetail(data);
        setUrl(data.url);
        setUrlFile(data.backgroundUrl)
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
      contentAdmin: JSON.stringify(contentAdmin),
      backgroundUrl: urlFile
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

  const handleUpdateEditor = (content, view) => {
    setContentAdmin(view);
    setContent(content)
  }

  const uploadBackground = async (file) => {
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
    <React.Fragment>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb parent="Tin tức" pageName="Thông tin chi tiết" />
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
          {(urlFile || blogDetail?.backgroundUrl) &&
            <img src={urlFile || blogDetail?.backgroundUrl || ""} alt="image" className="w-[350px] h-[200px] object-contain " />
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
                    uploadBackground(file);
                  }} />
                <span>
                  <img src="/admin/images/user/ic-camera.svg" alt="ic_camera" className="fill-current" />
                </span>
                <span>Upload</span>
              </label>
            </div>}
          />
          <div className="font-semibold mr-2 mb-5 border-b border-stroke">Nội dung: </div>
          <div className="w-full">
            {/* <EditorConfig /> */}
            {contentAdmin ?
              <EditorNovelDefault contentAdmin={contentAdmin} handleUpdateEditor={handleUpdateEditor} />
              : <EditorNovel handleUpdateEditor={handleUpdateEditor} />
            }
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

export default BlogsDetailPage;
