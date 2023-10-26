"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Buttons from "@/components/Buttons";
import moment from "moment";
import Loading from 'components/Loading';
import Link from "next/link";

import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const Item = ({ title, value }) => {
  return (
    <div className="flex items-center text-lg min-h-[50px]">
      <div className="font-semibold mr-2 min-w-[170px]">{title}: </div>
      <div>{value}</div>
    </div>
  )
}

interface ProductsDetailProp {
  createdAt: number;
  description: string;
  id: number;
  image: string;
  name: string;
  price: number;
  rating: number;
  status: number;
  stock: number;
  updatedAt: number;
  viewCount: number;
}

const ProductDetailPage = () => {
  let id = new URLSearchParams(location.search).get('id');
  const router = useRouter();
  const [productDetail, setProductDetail] = useState<ProductsDetailProp>()
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    if (productDetail) {
      setValue("description", productDetail.description || '');
      setValue("price", productDetail.price || 0);
      setValue("stock", productDetail.stock || 0);
    }
  }, [productDetail]);

  const getProducts = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/products/${id}`);
    try {
      if (resp.data) {
        setProductDetail(resp.data);
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
    getProducts(id);
  }, [id]);

  const onSubmit = handleSubmit(async (data) => {
    setloading(true);
    const params = {
      ...productDetail,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description
    }
    const resp = await request.put(`api/v1/products/${id}`, params);
    try {
      router.push("/products")
    } catch (error) {
      console.log(error)
    } finally {
      setloading(false);
    }
  })
  return (
    <form onSubmit={onSubmit}>
      <Breadcrumb parent="Sản phẩm" pageName="Thông tin chi tiết sản phẩm" />
      <div className="relative bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg ">
        {loading &&
          <div className="min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full"><Loading /></div>
        }
        <div className="p-5 flex flex-col sm:flex-row">
          <div className="md:max-w-[280px] sm:max-w-full">
            <div className="bg-gray-800 mb-3 text-lg font-semibold">Hình ảnh sản phẩm:</div>
            <img src={productDetail ? productDetail.image : ''} alt="image" className="w-[260px] h-[360px]" />
          </div>
          <div className="rounded-sm mb-5 md:p-10 grid sm:p-1 mt-4 sm:mt-0">
            <Item title="Mã sản phẩm" value={productDetail ? productDetail.id : '-'} />
            <Item title="Tên sản phẩm" value={productDetail ? productDetail.name : '-'} />
            <Item title="Thời gian tạo" value={productDetail ? moment(productDetail.createdAt).format('DD/MM/YYYY') : '-'} />
            <Item title="Đánh giá sản phẩm" value={productDetail ? productDetail.rating : '-'} />
            <Item title="Lượt xem" value={productDetail ? productDetail.viewCount : '-'} />

            <Item
              title="Giá sản phẩm"
              value={<div className="relative">
                <input
                  type="number"
                  {...register('price')}
                  placeholder="Giá sản phẩm"
                  className="w-full min-w-[300px] rounded-lg border border-stroke bg-transparent py-2 pl-2 pr-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item
              title="Số lượng tồn kho"
              value={<div className="relative">
                <input
                  type="number"
                  {...register('stock')}
                  placeholder="Tồn kho"
                  className="w-full min-w-[300px] rounded-lg border border-stroke bg-transparent py-2 pl-2 pr-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
            <Item
              title="Mô tả sản phẩm"
              value={<div className="relative">
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Mô tả"
                  className="w-full min-w-[300px] rounded-lg border border-stroke bg-transparent py-2 pl-2 pr-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>}
            />
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-1 bg-white shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600">
        <Link href="/products" className="inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10">
          Huỷ
        </Link>
        <Buttons
          type="primary"
          className="!bg-success hover:!bg-stroke">
          Cập nhật
        </Buttons>
      </footer>
    </form>
  );
};

export default ProductDetailPage;
