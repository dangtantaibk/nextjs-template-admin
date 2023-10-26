import React from "react";
import Image from "next/image";
import { ProductApiProps, ProductProps } from "models/products"
interface TableThreeProps {
  products: ProductApiProps[];
}

const TableThree = (props: TableThreeProps) => {
  const { products } = props;
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="py-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Danh sách sản phẩm</div>
        <div>button ở đây nè</div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Package
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Invoice date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {product.name}
                  </h5>
                  <p className="text-sm">${product.price}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {product.updatedAt}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {/* <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${packageItem.status === "Paid"
                        ? "text-success bg-success"
                        : packageItem.status === "Unpaid"
                          ? "text-danger bg-danger"
                          : "text-warning bg-warning"
                      }`}
                  >
                    {packageItem.status}
                  </p> */}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      <Image src={"/admin/images/product/eye.svg"} alt="eye" width={19} height={19} className="fill-current" />
                    </button>
                    <button className="hover:text-primary">
                      <Image src={"/admin/images/product/delete.svg"} alt="delete" width={19} height={19} className="fill-current" />
                    </button>
                    <button className="hover:text-primary">
                      <Image src={"/admin/images/product/download.svg"} alt="download" width={19} height={19} className="fill-current" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
