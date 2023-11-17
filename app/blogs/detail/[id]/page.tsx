"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import moment from "moment";
import Link from "next/link";

import { Breadcrumb, Buttons, EditorNovelTailwind, LabelTailwind, Loading, Notification, UploadFile } from "@/components";
import { BlogsDetailProp } from "models/blogs";
import { useRouter } from 'next/navigation';

const notiDetail = {
  isOpen: false,
  message: "",
  type: ""
}

const BlogsDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const [blogDetail, setBlogDetail] = useState<BlogsDetailProp>()
  const [loading, setloading] = useState(false);
  const [content, setContent] = useState<any>();
  const [contentAdmin, setContentAdmin] = useState<any>({});
  const [contentPreAdmin, setContentPreAdmin] = useState<any>({});
  const [url, setUrl] = useState("");
  const [urlFile, setUrlFile] = useState("");
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

  return (
    <React.Fragment>
      {notification.isOpen &&
        <Notification type={notification.type} message={notification.message} onClose={() => {
          setNotification(notiDetail)
        }} />
      }
      <Breadcrumb parent="Tin tức" pageName="Thông tin chi tiết" />
      <div className={styles.root_bg}>
        {loading &&
          <div className={styles.loading}><Loading /></div>
        }
        <div className="p-4">
          <div className={styles.wrapper}>
            <LabelTailwind title="Mã tin tức" value={blogDetail ? blogDetail.id : '-'} />
            <LabelTailwind title="Tên tin tức" value={blogDetail ? blogDetail.title : '-'} />
            <LabelTailwind title="Thời gian tạo" value={(blogDetail && blogDetail.createdAt) ? moment(blogDetail.createdAt).format('DD/MM/YYYY') : '-'} />
            <LabelTailwind title="Link tin tức" value={
              <input
                type="text"
                defaultValue={url}
                onChange={(e) => {
                  e.preventDefault();
                  const value = e.target.value;
                  setUrl(value);
                }}
                placeholder="Link tin tức"
                className={styles.input} />
            } />
          </div>
          <UploadFile
            setNotification={setNotification}
            setUrlFile={setUrlFile}
            urlFile={urlFile || ""}
            className="w-[350px] h-[200px] object-contain"
            title="Cập nhập hình nền"
          />
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
          className={styles.btnSubmit}
          onClick={() => {
            handleUpdate()
          }}>
          Cập nhật
        </Buttons>
      </footer>
    </React.Fragment>
  );
};

const styles = {
  root_bg: 'relative border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  wrapper: 'grid grid-cols-1 gap-5 rounded-sm mb-4',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default BlogsDetailPage;
