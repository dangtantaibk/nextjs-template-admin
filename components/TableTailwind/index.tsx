
import React, { ReactElement, memo, useRef, useState, useEffect } from "react";
import Loading from 'components/Loading';
import Image from "next/image";

interface PaginationProps {
  pageSizeOptions: number[],
  pageSize: number,
  current: number,
}
interface TableTailwindProps {
  title: string;
  columns: any;
  loading?: boolean;
  dataSource: any | [];
  toolBarRender?: ReactElement[];
  total?: number;
  pagination?: PaginationProps;
  setPagination?: Function;
}

const Nondata = ({ width }) => {
  return (
    <div style={{ width: width }} className="min-h-[220px] flex items-center justify-center">
      <div className="flex items-center justify-center">
        <div className="flex flex-row space-x-4">
          <div className="text-center">
            <Image src={"/admin/images/table/folder.svg"} alt="eye" width={48} height={48} />
            <div style={{ color: '#e3e3e3', fontSize: 13 }}>Trống</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Pagination = ({ total, pagination, setPagination }) => {
  const pageSize = pagination.pageSize;
  const pageActive = pagination.current;
  const pageSizeOptions = pagination.pageSizeOptions;
  const totalPage = Math.ceil(total / pageSize);

  const MAX_VISIBLE_PAGES = 5;

  const getPageNumbers = () => {
    const pageNumbers: any = [];
    if (totalPage <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (pageActive < MAX_VISIBLE_PAGES - 2) {
        for (let i = 1; i <= MAX_VISIBLE_PAGES - 2; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPage - 1);
        pageNumbers.push(totalPage);
      } else if (pageActive >= totalPage - MAX_VISIBLE_PAGES + 2) {
        for (let i = totalPage - MAX_VISIBLE_PAGES + 1; i <= totalPage; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = pageActive - 1; i <= pageActive + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPage - 1);
        pageNumbers.push(totalPage);
      }
    }
    return pageNumbers;
  };

  return (
    <div>
      <div className="flex items-center justify-end  mt-5">
        Page size:
        <select
          onChange={(e) => {
            setPagination({ ...pagination, pageSize: Number(e.target.value), current: 1 })
          }}
          value={pageSize}
          id="number"
          className="bg-gray-50 text-gray-900 text-sm rounded-lg block max-w-[100px] p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ">
          {pageSizeOptions.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="flex flex-col lg:flex-row items-center space-x-2 text-xs">
          <p className="text-gray-500 mt-4 lg:mt-0">{(pageActive - 1) * pageSize + 1} đến {pageActive === totalPage ? total : pageActive * pageSize} trong tổng {total} dòng</p>
        </div>
        <nav aria-label="Pagination" className="flex justify-center items-center text-gray-600 mt-8 lg:mt-0">
          <a
            className="p-2 mr-1 rounded hover:bg-gray cursor-pointer hover:text-primary"
            onClick={() => {
              if (pageActive === 1) {
                return;
              }
              setPagination({ ...pagination, current: pageActive - 1 });
            }}
          >
            <Image src={"/admin/images/table/left_arrow.svg"} alt="left_arrow" width={24} height={24} />
          </a>
          {getPageNumbers().map((page, index) => {
            return (
              <a
                onClick={() => {
                  if (page !== '...') {
                    setPagination({ ...pagination, current: page });
                  }
                }}
                className={`px-3 py-1 mx-1 rounded hover:bg-gray cursor-pointer ${page === pageActive ? 'text-primary bg-gray' : ''}`}
                key={index}
              >
                {page}
              </a>
            );
          })}
          <a
            className="p-2 ml-1 mr-4 rounded hover-bg-gray cursor-pointer hover-text-primary"
            onClick={() => {
              if (pageActive === totalPage) {
                return;
              }
              setPagination({ ...pagination, current: pageActive + 1 });
            }}
          >
            <Image src={"/admin/images/table/right_arrow.svg"} alt="left_arrow" width={24} height={24} />
          </a>
        </nav>
      </div>
    </div>
  )
}

const pageSizeDefault = {
  pageSizeOptions: [10, 20, 50, 100, 500],
  pageSize: 10,
  current: 1,
}

const TableTailwind = (props: TableTailwindProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    title,
    columns,
    loading = false,
    dataSource,
    toolBarRender,
    total,
    pagination = pageSizeDefault,
    setPagination } = props;

  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.getBoundingClientRect().width;
      setWidth(width - 60);
    }
  }, [width]);


  return (
    <div ref={ref} className="min-h-[220px] rounded-sm bg-white px-5 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {loading ? <div className="min-h-[220px] flex items-center justify-center"><Loading /></div> :
        <React.Fragment>
          <div className="py-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{title}</div>
            <div style={{ display: 'flex' }}>
              {toolBarRender?.map((item, index) => (
                <div key={index} className="pl-3">{item}</div>
              ))}
              <div className="pl-3">
                <button className="hover:text-primary">
                  <Image src={"/admin/images/table/setting.svg"} alt="eye" width={19} height={19} className="fill-current" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {columns.map((column, index) => (
                    <th key={index} style={{ minWidth: column.width }} className="py-4 px-4 font-medium text-black dark:text-white">
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ minHeight: 200 }}>
                {dataSource.length > 0 && dataSource?.map((data: any, indx) => (
                  <tr key={indx}>
                    {columns.map((column: any, index) => {
                      return (
                        <td key={index} className={`${indx !== dataSource.length - 1 && 'border-b border-[#eee]'} py-5 px-4 ${indx === dataSource.length - 1 && 'dark:border-strokedark'}`}>
                          <div className="text-black dark:text-white">
                            {!!column.render ? column.render(data[`${column.key}`], data) : data[`${column.key}`]}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dataSource.length === 0 &&
            <Nondata width={width} />
          }
          <Pagination total={total} pagination={pagination} setPagination={setPagination} />
        </React.Fragment>
      }
    </div>
  );
};

export default memo(TableTailwind);
