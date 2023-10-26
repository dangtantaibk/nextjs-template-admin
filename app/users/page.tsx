"use client"
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTailwind from "@/components/TableTailwind";
import Buttons from "@/components/Buttons";
import Image from "next/image";
import request from '@/utils/request';

import { useRouter } from 'next/navigation';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setloading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    pageSizeOptions: [10, 20, 50, 100, 500],
    pageSize: 10,
    current: 1,
  });

  const router = useRouter();

  const getListProducts = async () => {
    setloading(true)
    const page = pagination.current - 1;
    const size = pagination.pageSize;
    const resp: any = await request(`api/v1/users?page=${page}&size=${size}`);
    try {
      if (!!resp.data.content && resp.data.content.length > 0) {
        setUsers(resp.data.content);
        setTotal(resp.data.totalElements);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    getListProducts();
  }, [])

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 65,
    },
    {
      title: 'Hình ảnh nhân viên',
      key: 'avatar',
      dataIndex: 'avatar',
      width: 200,
      render: (dom, entity) => {
        return (<img src={dom || 'https://vapa.vn/wp-content/uploads/2022/12/anh-dai-dien-zalo-dep-001.jpg'} alt={entity.id} style={{ width: 180, height: 120, objectFit: 'cover' }} />)
      }
    },
    {
      title: 'Tên nhân viên',
      key: 'name',
      dataIndex: 'name',
      width: 200,
      render: (dom, entity) => {
        return dom ? dom : entity.username || '-'
      }
    },
    {
      title: 'Tên đăng nhập',
      key: 'username',
      dataIndex: 'username',
      width: 200,
    },
    {
      title: 'Chức danh',
      key: 'title',
      dataIndex: 'title',
      width: 170,
      render: (dom, entity) => {
        return dom ? dom : 'Nhân viên'
      }
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
            tooltip="Xem thông tin nhân viên"
            onClick={() => {
              router.push(`/users/detail?id=${entity.id}`);
            }}>
            <Image src={"/admin/images/product/eye.svg"} alt="eye" width={19} height={19} className="fill-current" />
          </Buttons>
          <Buttons
            type="link"
            tooltip="Xoá nhân viên"
            onClick={() => {
              // onDelete(entity.id)
            }}>
            <Image src={"/admin/images/product/delete.svg"} alt="delete" width={19} height={19} className="fill-current" />
          </Buttons>
        </div>)
      }
    },
  ]

  return (
    <React.Fragment>
      <Breadcrumb pageName="Danh sách nhân viên" />
      <div className="flex flex-col gap-10">
        <TableTailwind
          title="Danh sách nhân viên"
          columns={columns}
          dataSource={users}
          loading={loading}
          total={total}
          pagination={pagination}
          setPagination={setPagination}
          toolBarRender={[
            <Buttons type="link" tooltip="Thêm nhân viên" onClick={() => {
              router.push(`/users/create`);
            }}>
              <Image src={"/admin/images/product/plus.svg"} alt="eye" width={19} height={19} className="fill-current" />
            </Buttons>
          ]}
        />
      </div>
    </React.Fragment>
  );
};

export default UsersPage;
