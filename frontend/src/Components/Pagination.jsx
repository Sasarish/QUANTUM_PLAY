import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

const Pagination = ({
  currentPage,
  onPageChange,
  nextPageText = <ChevronRight size={20} />,
  prevPageText = <ChevronLeft size={20} />,
  firstPageText = <ChevronsLeft size={20} />,
  lastPageText = <ChevronsRight size={20} />

}) => {

  const { totalPages, products } = useSelector((state) => state.product);
  if (!products || products.length === 0 || totalPages <= 1) return null;

  //Getting pagenumbers function
  const getPageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 1;
    for (let i = Math.max(1, currentPage - pageWindow); i <= Math.min(totalPages, currentPage + pageWindow); i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  //button Styles
  const btnBase = "relative inline-flex items-center justify-center w-10 h-10 text-sm font-semibold transition-all duration-300 ease-in-out rounded-full mx-1";
  const activeBtn = "bg-gray-600 text-white shadow-lg shadow-gray-200 ring-2 ring-gray-600 ring-offset-2 scale-110";
  const inActiveBtn = "text-gray-600 hover:bg-gray-200 hover:text-gray-600 hover:scale-105 border border-transparent";
  const controlBtn = "bg-white border border-gray-200 text-gray-500 hover:border-gray-600 hover:text-gray-600 shadow-sm"

  return (
    <div className='flex flex-col items-center justify-center gap-4 my-12'>
      <div className='flex items-center p-2 bg-white rounded-full shadow-md border border-gray-100'>

        {/*First & Prev */}
        <div className='flex gap-1 mr-2 border-r pr-2 border-gray-100'>
          <button
            disabled={currentPage === 1}
            className={`${btnBase} ${controlBtn} disabled:opacity-30 disabled:hover:scale-100`}
            title='First Page'
            onClick={() => { onPageChange(1) }}>
            {firstPageText} </button>
          <button
            disabled={currentPage === 1}
            onClick={() => { onPageChange(currentPage - 1) }}
            className={`${btnBase} ${controlBtn} disabled:opacity-30 disabled:hover:scale-100`}
            title='Previous Page'
          >
            {prevPageText}</button>
        </div>

        {/*Page Number */}
        <div className='flex gap-1'>
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={`${btnBase} ${currentPage === number ? activeBtn : inActiveBtn}`}
            >
              {number}
            </button>
          ))}
        </div>

        {/*Last & next */}
        <div className='flex gap-1 ml-2 border-l pl-2 border-gray-100'>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${btnBase} ${controlBtn} disabled:opacity-30 disabled:hover:scale-100`}
            title='Next Page'
          >
            {nextPageText}
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`${btnBase} ${controlBtn} disabled:opacity-30 disabled:hover:scale-100`}
            title='Last Page'
          >
            {lastPageText}
          </button>
        </div>
      </div>
      <p className='text-xs text-gray-400 font-medium tracking-wide uppercase'>Page {currentPage} of {totalPages}</p>
    </div>
  )
}

export default Pagination