"use client";

import React, { Suspense } from "react";

const rows = [
  ["Monday", "8:30 - 11:30", "12:30 - 15:30" ],
  ["Tuesday", "8:30 - 11:30", "12:30 - 15:30" ],
  ["Wednesday", "8:30 - 11:30", "12:30 - 15:30" ],
  ["Thursday", "8:30 - 11:30", "12:30 - 15:30" ],
  ["Friday", "8:30 - 11:30", "12:30 - 15:30" ],
  ["Saturday", "-", "-" ],
  ["Sunday", "-", "-" ],
];

export default function OpenTimes() {
  return (
    <div className="mr-2 w-[82%] md:mr-0 md:w-full">

      <div className="flex flex-col">
        <table>
          <thead>
            <tr>
              <th className="w-[32%] items-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full">
                Day
              </th>
              <th className="w-[32%] items-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full">
                Morning
              </th>
              <th className="w-[32%] items-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full">
                Afternoon
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, index) => (
                  <td key={index} className="w-[32%] items-center text-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
