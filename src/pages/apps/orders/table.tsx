import React, { JSX } from 'react';
import { Table as BootstrapTable, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Ensure you have react-router-dom installed

interface Column {
  Header: string;
  accessor: string;
  Cell?: ({ row }: { row: any }) => JSX.Element | null; // Allow null
}

interface TableProps {
  columns: Column[];
  data: any[];
  isSearchable?: boolean;
  pageSize?: number;
  sizePerPageList?: number[];
  isSortable?: boolean;
  pagination?: boolean;
  isSelectable?: boolean;
  theadClass?: string;
  searchBoxClass?: string;
  searchHandler?: (value: string) => void;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  isSearchable = false,
  pageSize = 10,
  sizePerPageList = [10, 25, 50],
  isSortable = false,
  pagination = false,
  isSelectable = false,
  theadClass = '',
  searchBoxClass = '',
  searchHandler = () => {},
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const indexOfLastRow = currentPage * pageSize;
  const indexOfFirstRow = indexOfLastRow - pageSize;
  const paginatedData = data.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {isSearchable && (
        <div className={searchBoxClass}>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => searchHandler(e.target.value)}
          />
        </div>
      )}

      <BootstrapTable striped bordered hover className="table-responsive">
        <thead className={theadClass}>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{col.Cell ? col.Cell({ row }) : row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </BootstrapTable>

      {pagination && (
        <Row>
          <Col>
            <div className="text-end">
              <ul className="pagination pagination-rounded justify-content-end">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <Link
                    className="page-link"
                    to="#"
                    aria-label="Previous"
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  >
                    <span aria-hidden="true">«</span>
                    <span className="visually-hidden">Previous</span>
                  </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <Link
                      className="page-link"
                      to="#"
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </Link>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <Link
                    className="page-link"
                    to="#"
                    aria-label="Next"
                    onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  >
                    <span aria-hidden="true">»</span>
                    <span className="visually-hidden">Next</span>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Table;