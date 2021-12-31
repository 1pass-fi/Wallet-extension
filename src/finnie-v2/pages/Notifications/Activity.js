import React, { useMemo } from 'react'

import ViewBlockIcon from 'img/v2/view-block.svg'

import formatLongString from 'finnie-v2/utils/formatLongString'

const Activity = () => {
  const columns = useMemo(() => ['Date', 'Action', 'From', 'To', 'Amount', ''], [])
  const data = useMemo(
    () => [
      {
        date: '11/12/2021',
        action: 'Sent Koii',
        from: 'ETH Account',
        to: '6VJYLb6lvBISrgRbhd1ODHzJ1xAh3ZA3OdSY20E88Bg',
        amount: '-15 KOII'
      },
      {
        date: '11/12/2021',
        action: 'Sent Koii',
        from: 'ETH Account',
        to: '6VJYLb6lvBISrgRbhd1ODHzJ1xAh3ZA3OdSY20E88Bg',
        amount: '-15 KOII'
      }
    ],
    []
  )

  return (
    <div className="pt-4 text-white">
      <h1 className="text-32px font-semibold underline">Activity</h1>
      <table className="w-full text-left table-auto border-collapse">
        <thead>
          <tr className="text-base h-13.75 font-semibold border-b border-white px-4">
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="h-15 border-b border-blue-700 px-4">
              <td>{item.date}</td>
              <td>{item.action}</td>
              <td>{item.from}</td>
              <td>{formatLongString(item.to, 20)}</td>
              <td>{item.amount}</td>
              <td>
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-end text-xs text-turquoiseBlue underline font-semibold leading-5"
                >
                  <ViewBlockIcon className="pr-1.375" />
                  Explore Block
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Activity
