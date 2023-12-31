"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import request from '@/utils/request';
import moment from "moment";

import { Breadcrumb, TableTailwind, Buttons } from "@/components";
import { useRouter } from 'next/navigation';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
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
    const resp: any = await request(`api/v1/products?page=${page}&size=${size}`);
    try {
      if (!!resp.data.content && resp.data.content.length > 0) {
        setProducts(resp.data.content);
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
  }, []);

  const onDelete = async (id) => {
    const resp = await request.delete(`/api/v1/products/${id}`);
    try {
      if (resp.status === 204) {
        getListProducts();
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
      title: 'Tên sản phẩm',
      key: 'name',
      dataIndex: 'name',
      width: 260,
    },
    {
      title: 'Hình ảnh',
      key: 'image',
      dataIndex: 'image',
      width: 200,
      render: (dom, entity) => {
        return (<img src={dom} alt={entity.id} style={{ width: 180, height: 120, objectFit: 'cover' }} />)
      }
    },
    {
      title: 'Giá sản phẩm',
      key: 'price',
      dataIndex: 'price',
      width: 170,
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      dataIndex: 'rating',
      width: 170,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      width: 170,
    },
    {
      title: 'Hàng tồn',
      key: 'stock',
      dataIndex: 'stock',
      width: 170,
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
      width: 170,
      render: (dom, entity) => {
        return (<div className="flex items-center space-x-3.5">
          <Buttons
            type="link"
            tooltip="Xem chi tiết sản phẩm"
            onClick={() => {
              router.push(`/products/detail/${entity.id}`);
            }}>
            <Image src={"/admin/images/product/eye.svg"} alt="eye" width={19} height={19} className="fill-current" />
          </Buttons>
          <Buttons
            type="link"
            tooltip="Xoá sản phẩm"
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
      <Breadcrumb parent="Sản phẩm" pageName="Danh sách sản phẩm" />
      <div className="flex flex-col gap-10">
        <TableTailwind
          title="Danh sách sản phẩm"
          columns={columns}
          dataSource={products}
          loading={loading}
          total={total}
          pagination={pagination}
          setPagination={setPagination}
          toolBarRender={[
            <Buttons type="link" tooltip="Thêm sản phẩm" key={1} onClick={() => {
              router.push(`/products/create`);
            }}>
              <Image src={"/admin/images/product/plus.svg"} alt="eye" width={19} height={19} className="fill-current" />
            </Buttons>
          ]}
        />
      </div>
    </React.Fragment>
  );
};

export default ProductsPage;
