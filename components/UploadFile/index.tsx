"use client"
import React from "react";
import Image from "next/image";
import LabelTailwind from "../LabelTailwind";

import { token } from '@/utils/config';
import { AUTH_DOMAIN } from 'constant';

interface UploadFileProps {
  setNotification: Function;
  setUrlFile: Function;
  urlFile: string;
  className: string;
  title: string;
  titleBtn?: string;
}

const UploadFile = (props: UploadFileProps) => {
  const { setNotification, setUrlFile, urlFile, className, title, titleBtn = "Upload" } = props;

  const uploadFile = async (file) => {
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
          'Authorization': `Bearer ${token()}`
        }
      })
        .then(response => response.json())
        .then(data => {
          try {
            if (data.data) {
              setUrlFile(data.data.url);
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
  };

  return (
    <React.Fragment>
      <LabelTailwind
        title={title}
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
                uploadFile(file)
              }} />
            <span>
              <Image src="/admin/images/user/ic-camera.svg" alt="ic_camera" width={19} height={19} className="fill-current" />
            </span>
            <span>{titleBtn}</span>
          </label>
        </div>}
      />
      {urlFile && <img src={urlFile} alt="image" className={className} />}
    </React.Fragment>
  );
};

export default UploadFile;
