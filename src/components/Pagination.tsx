// Pagination.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

interface PaginationProps {
  tableProps: any;
  sizePerPageList: { text: string; value: number }[];
  onPageChange?: (page: number) => void;
  onSizePerPageChange?: (size: number) => void;
  totalPages?: number;
  currentPage?: number;
}

const Pagination = ({
  tableProps,
  sizePerPageList,
  onPageChange,
  onSizePerPageChange,
  totalPages,
  currentPage,
}: PaginationProps) => {
  const { setPageSize, state: { pageSize } } = tableProps;
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  const filterPages = useCallback(
    (visiblePages: number[], totalPages: number) => {
      return visiblePages.filter((page) => page <= totalPages);
    },
    []
  );

  const getVisiblePages = useCallback(
    (page: number, total: number) => {
      if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
      } else if (page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    },
    [filterPages]
  );

  useEffect(() => {
    if (totalPages && currentPage) {
      const newVisiblePages = getVisiblePages(currentPage, totalPages);
      setVisiblePages(newVisiblePages);
    }
  }, [currentPage, totalPages, getVisiblePages]);

  const changePage = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="d-lg-flex align-items-center text-center pb-1">
      {sizePerPageList.length > 0 && (
        <div className="d-inline-block me-3 ps-2">
          <label className="me-1">Display :</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              if (onSizePerPageChange) onSizePerPageChange(newSize);
            }}
            className="form-select d-inline-block w-auto"
          >
            {sizePerPageList.map((pageSize, index) => (
              <option key={index} value={pageSize.value}>
                {pageSize.text}
              </option>
            ))}
          </select>
        </div>
      )}

      <span className="me-6">
        Page{" "}
        <strong>
          {currentPage} of {totalPages}
        </strong>{" "}
      </span>

      {/* <span className="d-inline-block align-items-center text-sm-start text-center my-sm-0 my-2">
        <label className="form-label">Go to page : </label>
        <input
          type="number"
          value={currentPage}
          min="1"
          max={totalPages}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) : 1;
            changePage(page);
          }}
          className="form-control w-25 ms-1 d-inline-block"
        />
      </span> */}

      <ul className="pagination pagination-rounded d-inline-flex ms-auto align-item-center mb-0">
        <li
          className={classNames("page-item", "paginate_button", "previous", {
            disabled: currentPage === 1,
          })}
          onClick={() => currentPage && currentPage > 1 && changePage(currentPage - 1)}
        >
          <Link to="#" className="page-link">
            <i className="mdi mdi-chevron-left"></i>
          </Link>
        </li>
        {visiblePages.map((page, index, array) => (
          array[index - 1] + 1 < page ? (
            <React.Fragment key={page}>
              <li className="page-item disabled d-none d-xl-inline-block">
                <Link to="#" className="page-link">
                  ...
                </Link>
              </li>
              <li
                className={classNames("page-item", "d-none", "d-xl-inline-block", {
                  active: currentPage === page,
                })}
                onClick={() => changePage(page)}
              >
                <Link to="#" className="page-link">
                  {page}
                </Link>
              </li>
            </React.Fragment>
          ) : (
            <li
              key={page}
              className={classNames("page-item", "d-none", "d-xl-inline-block", {
                active: currentPage === page,
              })}
              onClick={() => changePage(page)}
            >
              <Link to="#" className="page-link">
                {page}
              </Link>
            </li>
          )
        ))}
        <li
          className={classNames("page-item", "paginate_button", "next", {
            disabled: currentPage === totalPages,
          })}
          onClick={() => currentPage && totalPages && currentPage < totalPages && changePage(currentPage + 1)}
        >
          <Link to="#" className="page-link">
            <i className="mdi mdi-chevron-right"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;