"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import request from '@/utils/request';

import { Breadcrumb, TableTailwind, Buttons } from "@/components";
import { useRouter } from 'next/navigation';

const CategoryBlogsPage = () => {
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [loading, setloading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    pageSizeOptions: [10, 20, 50, 100, 500],
    pageSize: 10,
    current: 1,
  });

  const router = useRouter();

  const getCategoryBlogs = async () => {
    setloading(true)
    const page = pagination.current - 1;
    const size = pagination.pageSize;
    const resp: any = await request(`api/v1/categoryBlogs?page=${page}&size=${size}`);
    try {
      if (!!resp.data.content && resp.data.content.length > 0) {
        setCategoryBlogs(resp.data.content);
        setTotal(resp.data.totalElements);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    getCategoryBlogs();
  }, [])

  const onDelete = async (id) => {
    const resp = await request.delete(`/api/v1/categoryBlogs/${id}`);
    try {
      if (resp.status === 204) {
        getCategoryBlogs();
      }
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
      title: 'Tên danh mục',
      key: 'name',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
      width: 100,
      render: (dom, entity) => {
        return (<div className="flex items-center space-x-3.5">
          <Buttons
            type="link"
            tooltip="Xem chi tiết danh mục"
            onClick={() => {
              router.push(`/category-blogs/detail/${entity.id}`);
            }}>
            <Image src={"/admin/images/product/eye.svg"} alt="eye" width={19} height={19} className="fill-current" />
          </Buttons>
          <Buttons
            type="link"
            tooltip="Xoá danh mục"
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
      <Breadcrumb pageName="Danh sách danh mục" />
      <div className="flex flex-col gap-10">
        <TableTailwind
          title="Danh sách danh mục"
          columns={columns}
          dataSource={categoryBlogs}
          loading={loading}
          total={total}
          pagination={pagination}
          setPagination={setPagination}
          toolBarRender={[
            <Buttons type="link" tooltip="Thêm danh mục" key={12} onClick={() => {
              router.push(`/category-blogs/create`);
            }}>
              <Image src={"/admin/images/product/plus.svg"} alt="eye" width={19} height={19} className="fill-current" />
            </Buttons>
          ]}
        />
      </div>
    </React.Fragment>
  );
};

export default CategoryBlogsPage;
