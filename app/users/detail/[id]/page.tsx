"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import Link from "next/link";

import { Breadcrumb, Buttons, Loading, Notification, LabelTailwind, UploadFile } from "@/components";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { UserDetail } from "models/users";

const UserDetailPage = ({ params }: { params: { id: string } }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const router = useRouter();
  const id = params.id;
  const [userDetail, setUserDetail] = useState<UserDetail>();
  const [loading, setloading] = useState(false);
  const [urlFile, setUrlFile] = useState("");

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const getUserDetail = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/users/${id}`);
    try {
      if (resp.data) {
        const user = resp.data;
        setUserDetail(user)
        setValue("title", user.title || '');
        setValue("name", user.name || "");
        setValue("username", user.username || '');
        setUrlFile(user.avatar)
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
    getUserDetail(id);
  }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = { ...userDetail, ...data, avatar: urlFile }
    const resp = await request.put(`/api/v1/users/${id}`, params);

    try {
      if (resp.status === 201) {
        router.push("/users")
        setNotification({ isOpen: true, message: "Cập nhật thông tin nhân viên thành công", type: "success" })
      } else {
        setNotification({ isOpen: true, message: "Cập nhật thông tin nhân viên thất bại", type: "error" })
      }
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
      <Breadcrumb parent="Thông tin nhân viên" pageName="Thông tin chi tiết" />
      <div className={styles.root}>
        {loading && <div className={styles.loading}><Loading /></div>}
        <div className="p-5">
          <div className={styles.wrapper}>
            <div className={styles.col}>
              <UploadFile
                setNotification={setNotification}
                setUrlFile={setUrlFile}
                urlFile={urlFile || userDetail?.avatar || '/admin/images/user/user-06.png'}
                className={styles.uploadfile}
                title="Cập nhập hình ảnh"
                titleBtn="Upload image product"
              />
            </div>
            <div className={styles.col}>
              <LabelTailwind
                title="Mã nhân viên"
                value={<div>{userDetail?.id || "-"}</div>}
              />
              <LabelTailwind
                title="Tên đăng nhập"
                value={<div className="relative">
                  <input
                    type="text"
                    disabled
                    {...register('username', {
                      required: 'Vui lòng nhập tên đăng nhập',
                    })}
                    placeholder="Tên đăng nhập"
                    className={styles.input}
                  />
                </div>}
              />
              <LabelTailwind
                title="Tên nhân viên"
                value={<div className="relative">
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Vui lòng nhập tên nhân viên',
                    })}
                    placeholder="Tên nhân viên"
                    className={styles.input}
                  />
                </div>}
              />
              <LabelTailwind
                title="Chức vụ"
                value={<div className="relative">
                  <input
                    type="text"
                    {...register('title')}
                    placeholder="Chức vụ"
                    className={styles.input}
                  />
                </div>}
              />
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/users" className={styles.btnLink}>Huỷ</Link>
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
  uploadfile: 'w-[200px] h-[200px] object-scale-down rounded-full border',
  input: 'w-full rounded-lg border border-stroke bg-transparent p-2 outline-none min-w-[350px] dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke',
}

export default UserDetailPage;
