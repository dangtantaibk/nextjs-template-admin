"use client"
import React, { useEffect, useState } from "react";
import request from '@/utils/request';
import moment from "moment";
import Link from "next/link";

import { Breadcrumb, Buttons, Loading, Notification, UploadFile, LabelTailwind } from "@/components";
import { ProductProps } from "models/products";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';

const ProductDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const [productDetail, setProductDetail] = useState<ProductProps>()
  const [loading, setloading] = useState(false);
  const [urlFile, setUrlFile] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const notiDetail = {
    isOpen: false,
    message: "",
    type: ""
  }
  const [notification, setNotification] = useState(notiDetail);

  const getProducts = async (id) => {
    setloading(true)
    const resp: any = await request(`api/v1/products/${id}`);
    try {
      if (resp.data) {
        setProductDetail(resp.data);
        setValue("description", resp.data.description || '');
        setValue("price", resp.data.price || 0);
        setValue("stock", resp.data.stock || 0);
        setUrlFile(resp.data.image)
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
      description: data.description,
      image: urlFile,
    }
    await request.put(`api/v1/products/${id}`, params);
    try {
      router.push("/products")
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
      <Breadcrumb parent="Sản phẩm" pageName="Thông tin chi tiết sản phẩm" />
      <div className={styles.root}>
        {loading &&
          <div className={styles.loading}><Loading /></div>
        }
        <div className={styles.root_bg}>
          <div className={styles.bgImage}>
            <div className={styles.title}>Hình ảnh sản phẩm:</div>
            <img src={urlFile || productDetail?.image || ""} alt="image" className="w-[260px] h-[360px] object-contain " />
            <UploadFile
              setNotification={setNotification}
              setUrlFile={setUrlFile}
              urlFile={""}
              className={styles.uploadfile}
              title="Cập nhập hình ảnh"
            />
          </div>
          <div className={styles.wrapper}>
            <LabelTailwind title="Mã sản phẩm" value={productDetail ? productDetail.id : '-'} width={170} />
            <LabelTailwind title="Tên sản phẩm" value={productDetail ? productDetail.name : '-'} width={170} />
            <LabelTailwind title="Thời gian tạo" value={productDetail ? moment(productDetail.createdAt).format('DD/MM/YYYY') : '-'} width={170} />
            <LabelTailwind title="Đánh giá sản phẩm" value={productDetail ? productDetail.rating : '-'} width={170} />
            <LabelTailwind title="Lượt xem" value={productDetail ? productDetail.viewCount : '-'} width={170} />
            <LabelTailwind
              title="Giá sản phẩm"
              value={<div className={styles.label}>
                <input
                  type="number"
                  {...register('price')}
                  placeholder="Giá sản phẩm"
                  className={styles.input}
                />
              </div>}
              width={170}
            />
            <LabelTailwind
              title="Số lượng tồn kho"
              value={<div className={styles.label}>
                <input
                  type="number"
                  {...register('stock')}
                  placeholder="Tồn kho"
                  className={styles.input}
                />
              </div>}
              width={170}
            />
            <LabelTailwind
              title="Mô tả sản phẩm"
              value={<div className={styles.label}>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Mô tả"
                  className={styles.input}
                />
              </div>}
              width={170}
            />
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <Link href="/products" className={styles.btnLink}>
          Huỷ
        </Link>
        <Buttons
          type="primary"
          className={styles.btnSubmit}>
          Cập nhật
        </Buttons>
      </footer>
    </form>
  );
};

const styles = {
  root: 'relative bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:shadow-lg',
  loading: 'min-h-[260px] h-full flex items-center justify-center absolute z-9999 bg-boxdark-10 w-full',
  root_bg: 'p-5 flex flex-col sm:flex-row',
  bgImage: 'md:max-w-[280px] sm:max-w-full',
  title: 'bg-gray-800 mb-3 text-lg font-semibold',
  uploadfile: 'w-[350px] h-[200px] object-contain',
  wrapper: 'rounded-sm mb-5 md:p-10 grid sm:p-1 mt-4 sm:mt-0',
  label: 'relative mt-3',
  input: 'w-full min-w-[300px] rounded-lg border border-stroke bg-transparent py-2 pl-2 pr-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary',
  footer: 'fixed bottom-0 left-0 z-20 w-full p-1 bg-white border-t border-gray-200 shadow flex md:items-center justify-end md:p-2 dark:bg-gray-800 dark:border-gray-600',
  btnLink: 'inline-flex rounded mr-2 items-center justify-center bg-meta-8 hover:!bg-stroke py-2 px-10 text-center font-medium text-white lg:px-8 xl:px-10',
  btnSubmit: '!bg-success hover:!bg-stroke'
}

export default ProductDetailPage;
