// Table.tsx
import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter,
  useAsyncDebounce,
  useExpanded,
  PluginHook,
} from "react-table";
import classNames from "classnames";
import Pagination from "./Pagination";

interface TableProps {
  isSearchable?: boolean;
  isSortable?: boolean;
  pagination?: boolean;
  isSelectable?: boolean;
  isExpandable?: boolean;
  sizePerPageList?: { text: string; value: number }[];
  columns: { Header: string; accessor: string; sort?: boolean; Cell?: any; className?: string }[];
  data: any[];
  pageSize?: number;
  searchBoxClass?: string;
  tableClass?: string;
  theadClass?: string;
  onPageChange?: (page: number) => void;
  onSizePerPageChange?: (size: number) => void;
  totalPages?: number; // Added to reflect server-side total pages
  currentPage?: number; // Added to reflect server-side current page
}

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchBoxClass,
}: any) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className={classNames(searchBoxClass)}>
      <span className="d-flex align-items-center">
        Search :{" "}
        <input
          type="search"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          className="form-control w-auto ms-1"
        />
      </span>
    </div>
  );
};

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <div className="form-check">
      <input type="checkbox" className="form-check-input" ref={resolvedRef} {...rest} />
      <label htmlFor="form-check-input" className="form-check-label"></label>
    </div>
  );
});

const Table = (props: TableProps) => {
  const {
    isSearchable = false,
    isSortable = false,
    pagination = false,
    isSelectable = false,
    isExpandable = false,
    sizePerPageList = [],
    onPageChange,
    onSizePerPageChange,
    totalPages,
    currentPage,
  } = props;

  const otherProps: any = {};
  if (isSearchable) otherProps.useGlobalFilter = useGlobalFilter;
  if (isSortable) otherProps.useSortBy = useSortBy;
  if (isExpandable) otherProps.useExpanded = useExpanded;
  if (pagination) otherProps.usePagination = usePagination;
  if (isSelectable) otherProps.useRowSelect = useRowSelect;

  const dataTable = useTable(
    {
      columns: props.columns,
      data: props.data,
      initialState: { pageSize: props.pageSize || 10, pageIndex: currentPage ? currentPage - 1 : 0 },
      pageCount: totalPages, // Use server-side total pages
      manualPagination: true, // Enable manual pagination for server-side
    },
    ...(Object.values(otherProps) as PluginHook<any>[]),
    (hooks) => {
      if (isSelectable) {
        hooks.visibleColumns.push((columns: any) => [
          {
            id: "selection",
            Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }: any) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
      if (isExpandable) {
        hooks.visibleColumns.push((columns: any) => [
          {
            id: "expander",
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
              <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? "-" : "+"}
              </span>
            ),
            Cell: ({ row }: any) =>
              row.canExpand ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: { paddingLeft: `${row.depth * 2}rem` },
                  })}
                >
                  {row.isExpanded ? "-" : "+"}
                </span>
              ) : null,
          },
          ...columns,
        ]);
      }
    }
  );

  const rows = dataTable.rows; // Use all rows since we're handling pagination server-side

  return (
    <>
      {isSearchable && (
        <GlobalFilter
          preGlobalFilteredRows={dataTable.preGlobalFilteredRows}
          globalFilter={dataTable.state.globalFilter}
          setGlobalFilter={dataTable.setGlobalFilter}
          searchBoxClass={props.searchBoxClass}
        />
      )}
      <div className="table-responsive">
        <table
          {...dataTable.getTableProps()}
          className={classNames("table table-centered react-table", props.tableClass)}
        >
          <thead className={props.theadClass}>
            {dataTable.headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps(column.sort && column.getSortByToggleProps())}
                    className={classNames({
                      sorting_desc: column.isSortedDesc === true,
                      sorting_asc: column.isSortedDesc === false,
                      sortable: column.sort === true,
                    })}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...dataTable.getTableBodyProps()}>
            {rows.map((row: any) => {
              dataTable.prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps([{ className: cell.column.className }])}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && (
        <Pagination
          tableProps={dataTable}
          sizePerPageList={sizePerPageList}
          onPageChange={onPageChange}
          onSizePerPageChange={onSizePerPageChange}
          totalPages={totalPages} // Pass total pages to Pagination
          currentPage={currentPage} // Pass current page to Pagination
        />
      )}
    </>
  );
};

export default Table;