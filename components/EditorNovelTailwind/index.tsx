"use client"
import React from "react";
import Image from "next/image";
import LabelTailwind from "@/components/LabelTailwind";

import { token } from '@/utils/config';
import { AUTH_DOMAIN } from 'constant';
import { EditorNovel, EditorNovelDefault, EditorNovelPre } from './components';

interface EditorNovelTailwindProps {
  setContent: Function;
  contentAdmin: any;
  setContentAdmin: Function;
  contentPreAdmin: any;
  setContentPreAdmin: Function;
  setNotification: Function;
}

const EditorNovelTailwind = (props: EditorNovelTailwindProps) => {

  const { setContent, contentAdmin, setContentAdmin, contentPreAdmin, setContentPreAdmin, setNotification } = props;

  const handleUpdateEditor = (content, view) => {
    setContentAdmin(view);
    setContent(content)
  }

  const uploadFileImage = async (file) => {
    setContentPreAdmin({});
    const TYPE_IMAGE = ['image/png', 'image/jpeg', 'image/gif'];
    const formData = new FormData();
    if (!TYPE_IMAGE.includes(file.type)) {
      setNotification({ isOpen: true, message: "Vui lòng chọn file ảnh *png, *jpeg, *gif", type: "error" })
    } else {
      try {
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
                if (Object?.keys(contentAdmin).length === 0) {
                  const dataContent = {
                    type: "doc",
                    content: [
                      {
                        type: "image",
                        attrs: {
                          src: data.data.url,
                          alt: data.data.url,
                          title: data.data.url,
                          width: null,
                          height: null,
                        },
                      },
                    ]
                  }
                  setContentAdmin(dataContent);
                } else {
                  const content = [...contentAdmin.content, {
                    type: "image",
                    attrs: {
                      src: data.data.url,
                      alt: data.data.url,
                      title: data.data.url,
                      width: null,
                      height: null,
                    },
                  },];
                  const dataContent = {
                    type: "doc",
                    content: content
                  }
                  setContentPreAdmin(dataContent);
                }
                setNotification({ isOpen: true, message: "Upload file thành công", type: "success" })
              } else {
                setNotification({ isOpen: true, message: data.message, type: "error" })
              }
            } catch (error) {
              setNotification({ isOpen: true, message: error, type: "error" })
            }
          })
          .catch(error => {
            setNotification({ isOpen: true, message: error, type: "error" })
          });
      } catch (error) {
        setNotification({ isOpen: true, message: error, type: "error" })
      }
    }
  };

  return (
    <React.Fragment>
      <div className="font-semibold mr-2 mb-5 mt-5 border-b border-stroke">Nội dung: </div>
      <div className="w-full">
        {Object?.keys(contentAdmin).length ?
          Object?.keys(contentPreAdmin).length !== 0 ?
            <EditorNovelPre contentAdmin={contentPreAdmin} handleUpdateEditor={handleUpdateEditor} />
            : <EditorNovelDefault contentAdmin={contentAdmin} handleUpdateEditor={handleUpdateEditor} />
          : <EditorNovel handleUpdateEditor={handleUpdateEditor} />
        }
      </div>
      <LabelTailwind
        title="Thêm hình ảnh vào nội dung"
        value={<div className="xsm:bottom-4 xsm:right-4">
          <label
            htmlFor="imageEditor"
            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
          >
            <input
              type="file"
              name="imageEditor"
              id="imageEditor"
              className="sr-only"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e: any) => {
                e.preventDefault();
                const file = e?.target?.files[0];
                uploadFileImage(file)
              }} />
            <span>
              <Image src="/admin/images/user/ic-camera.svg" alt="ic_camera" width={19} height={19} className="fill-current" />
            </span>
            <span>Thêm hình ảnh</span>
          </label>
        </div>}
      />
    </React.Fragment>
  );
};

export default EditorNovelTailwind;
