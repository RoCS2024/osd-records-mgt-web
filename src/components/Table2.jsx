//expandable and clickable table
import React from 'react';
import styles from '../styles/Table.module.css';

const Table = ({ columns, data, onRowClick, expandedRow, expandedContent }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.className}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <React.Fragment key={row.id}>
            <tr 
              onClick={() => onRowClick(row)}
              className={`${styles.tableRow} ${expandedRow === row.id ? styles.expanded : ''}`}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
            {expandedRow === row.id && (
              <tr>
                <td colSpan={columns.length}>
                  {expandedContent(row)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

