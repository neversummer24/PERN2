import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import api from '../libs/authApiCall';
import Loading from '../components/ui/loading';
import { MdAdd } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { CiExport } from 'react-icons/ci';
import { exportToExcel } from 'react-json-to-excel';
import DataRange from '../components/data-range';
import { formatCurrency } from '../libs/numberUtil';
import { RiProgress3Line } from 'react-icons/ri';
import { TiWarning } from 'react-icons/ti';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { AiOutlineEye } from 'react-icons/ai';
import ViewTransaction from '../components/view-transaction';
import AddTransaction from '../components/add-transaction';
import TablePagination from '../components/ui/table-pagination';


const Transaction = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenView, setIsOpenView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const handleView = (item) => {
    setSelected(item);
    setIsOpenView(true);
  }

  const getTransactions = async (page = 1, limit = 10) => {
    const URL = `/transaction?df=${startDate}&dt=${endDate}&s=${search}&page=${page}&limit=${limit}`;
    try {
      const { data: res } = await api.get(URL);
      setData(res.data);

      setPagination({
        currentPage: res.pagination.currentPage,
        pageSize: res.pagination.pageSize,
        totalItems: res.pagination.totalItems,
        totalPages: res.pagination.totalPages,
        hasNextPage: page < res.pagination.totalPages,
        hasPrevPage: page > 1
      });

    } catch (error) {
      console.log(error);
      toast.error(error.message);
      if (error?.response?.data?.status === 'auth_failed') {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefualt();
    setSearchParams({ df: startDate, dt: endDate });
    setIsLoading(true);
    await getTransactions();
  }

  useEffect(() => {
    setIsLoading(true);
    getTransactions(1, 10);
  }, [startDate, endDate, search]);

  const handlePageChange = async (newPage, limit) => {
    setIsLoading(true);
    await getTransactions(newPage, limit);
  }

  const handlePageSizeChange = (newSize) => {
    setIsLoading(true);
    getTransactions(1, newSize); // Reset to first page when changing page size
  };

  if (isLoading) {
    return <Loading />

  }
  return (
    <>
      <div className='w-full py-10'>
        <div className='flex  flex-col md:flex-row md:items-center gap-4'>
          <DataRange />

          <form onSubmit={(e) => handleSearch(e)}>
            <div className='w-full flex items-center gap-2 border border--gray-300 dark:border-gray-600 rounded-md px-2 py-2'>
              <IoSearchOutline className='text-xl text-gray-500 dark:text-gray-400' />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder='Search Transaction'
                className='group focus:outline-none bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-700 dark:placeholder:text-gray-400'
              />

              <div className="flex items-center gap-1">
                <label htmlFor="limit" className="text-sm text-gray-700 dark:text-gray-400">
                  Per page:
                </label>
                <select
                  id="limit"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="bg-transparent text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded p-1 text-sm"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </form>

          <button
            onClick={() => setIsOpenView(true)}
            className='py-2 px-2 rounded text-white bg-black dark:bg-violet-800 flex items-center justify-center gap-2'
          >
            <MdAdd size={22} />
            <span>Pay</span>
          </button>

          <button
            onClick={
              () => exportToExcel(data, `${startDate}-${endDate}`)
            }
            className='flex-items-center gap-2 text-black dark:text-gray-300'
          >
            Export <CiExport size={24} />

          </button>

        </div>

        <div className='mt-5 overflow-x-auto'>
          {data.length === 0 ? (
            <div className='w-full flex items-center justify-center py-10 text-gray-500 dark:text-gray-400 text-lg'>No Transaction Found</div>
          ) : (
            <>
              <table className='w-full'>
                <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
                  <tr className='text-left w-full text-black dark:text-gray-400'>
                    <th className='px-2 py-2'>Date</th>
                    <th className='px-2 py-2'>Description</th>
                    <th className='px-2 py-2'>Status</th>
                    <th className='px-2 py-2'>Source</th>
                    <th className='px-2 py-2'>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}
                      className='w-full border-b border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'>

                      <td className='py-4'>
                        <p className='w-24 md:w-auto'>
                          {new Date(item.createdAt).toDateString()}
                        </p>
                      </td>

                      <td className='px-2 py-4'>
                        <div className='flex lfex-col w-56 md:w-auto'>
                          <p className='text-base 2xl:text-lg text-black dark:text-gray-400 line-clamp-2'>{item?.description}</p>
                        </div>
                      </td>

                      <td className='py-4 px-2'>
                        <div className='flex items-center gap-2'>
                          {item.status === 'Pending' && <RiProgress3Line className='text-yellow-500' size={24} />}
                          {item.status === 'Completed' && <IoCheckmarkDoneCircle className='text-green-500' size={24} />}
                          {item.status === 'Rejected' && <TiWarning className='text-red-500' size={24} />}
                          <span>{item?.status}</span>
                        </div>
                      </td>

                      <td className='px-2 py-4'>
                        {item?.source}
                      </td>

                      <td className='py-4 text-black dark:text-gray-400 text-base font-medium'>
                        <span
                          className={`${item?.type === 'income' ? 'text-green-500' : 'text-red-500'} text-lg font-blod mgl-1`
                          }>{item?.type === 'income' ? '+' : '-'} {formatCurrency(item?.amount)}</span>
                      </td>

                      <td className='px-2 py-4'>
                        <div className='flex items-center gap-3'>
                          <button onClick={() => handleView(item)} className='outline-none text-violet-600 hover:underline'>
                            <AiOutlineEye size={24} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

              <TablePagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          )
          }
        </div>
      </div>

      <ViewTransaction
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        data={selected}
      />

      <AddTransaction
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
        refetch={getTransactions}
        key={new Date().getTime()}
      />
    </>
  )
}

export default Transaction;
