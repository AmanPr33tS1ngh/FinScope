import React from "react";

const Table = ({ children, tHeadData }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            {tHeadData.map((tHead) => (
              <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                {tHead}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
