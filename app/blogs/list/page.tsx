"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import request from '@/utils/request';
import moment from "moment";
import Link from "next/link";

import { Breadcrumb, TableTailwind, Buttons } from "@/components";
import { AUTH_DOMAIN } from 'constant';
import { useRouter } from 'next/navigation';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    pageSizeOptions: [10, 20, 50, 100, 500],
    pageSize: 10,
    current: 1,
  });

  const getListBlogs = async () => {
    setloading(true)
    const page = pagination.current - 1;
    const size = pagination.pageSize;
    const resp: any = await request(`api/v1/blogs?page=${page}&size=${size}`);

    try {
      if (!!resp.data.content && resp.data.content.length > 0) {
        const data = resp.data;
        setBlogs(data.content);
        setTotal(data.totalElements)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    getListBlogs();
  }, [pagination]);

  const onDelete = async id => {
    await request.delete(`/api/v1/blogs/${id}`);
    try {
      getListBlogs();
    } catch (error) {
      console.log(error)
    }
  }

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 65,
    },
    {
      title: 'Tiêu đề',
      key: 'title',
      dataIndex: 'title',
      width: 160,
    },
    {
      title: 'Mô tả ngắn',
      key: 'shortDesc',
      dataIndex: 'shortDesc',
      width: 170,
    },
    {
      title: 'Hình nền blog',
      key: 'backgroundUrl',
      dataIndex: 'backgroundUrl',
      width: 200,
      render: (dom, entity) => {
        if (dom) {
          return <img src={entity?.backgroundUrl || ""} alt="backgroundUrl" className="w-[180px] h-[150px] object-contain " />
        } else {
          return 'Không có hình nền'
        }
      }
    },
    {
      title: 'Link tin tức',
      key: 'url',
      dataIndex: 'url',
      width: 170,
      render: (dom, entity) => {
        const url = `${AUTH_DOMAIN}blog/${dom}`
        return <Link href={url} className="text-primary hover:cursor-pointer transition hover:bg-opacity-90">
          {dom}
        </Link>
      }
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      width: 120,
    },
    {
      title: 'Tác giả',
      key: 'author',
      dataIndex: 'author',
      width: 140,
    },
    {
      title: 'Thời gian cập nhật',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      width: 170,
      render: (dom, entity) => {
        return moment(dom).format('DD/MM/YYYY')
      }
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
      width: 100,
      render: (_, entity) => {
        return (<div className="flex items-center space-x-3.5">
          <Buttons
            type="link"
            tooltip="Xem chi tiết blog"
            onClick={() => {
              router.push(`/blogs/detail/${entity.id}`);
            }}>
            <Image src={"/admin/images/product/eye.svg"} alt="eye" width={19} height={19} className="fill-current" />
          </Buttons>
          <Buttons
            type="link"
            tooltip="Xoá blog"
            onClick={() => {
              onDelete(entity.id)

            }}>
            <Image src={"/admin/images/product/delete.svg"} alt="delete" width={19} height={19} className="fill-current" />
          </Buttons>
        </div>)
      }
    },
  ]

  return (
    <React.Fragment>
      <Breadcrumb parent="Tin tức" pageName="Danh sách tin tức" />
      <div className="flex flex-col gap-10">
        <TableTailwind
          title="Danh sách tin tức"
          columns={columns}
          dataSource={blogs}
          loading={loading}
          total={total}
          pagination={pagination}
          setPagination={setPagination}
          toolBarRender={[
            <Buttons
              type="link"
              tooltip="Thêm blog"
              key={13}
              onClick={() => {
                router.push(`/blogs/create`);
              }}>
              <Image src={"/admin/images/product/plus.svg"} alt="eye" width={19} height={19} className="fill-current" />
            </Buttons>
          ]}
        />
      </div>
    </React.Fragment>
  );
};

export default BlogsPage;
