"use client";

import React from "react";

export default function OpenTimes({openTimes}) {
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
            {openTimes.map((row, index) => (
              <tr key={index}>
                <td className="border-b-2 border-solid text-center border-gray-300 px-2 text-[13.13px] sm:w-full">
                  {row.day}
                </td>
                <td className="border-b-2 border-solid text-center border-gray-300 px-2 text-[13.13px] sm:w-full">
                  {row.morningOpen} - {row.morningClose}
                </td>
                <td className="border-b-2 border-solid text-center border-gray-300 px-2 text-[13.13px] sm:w-full">
                  {row.afternoonOpen} - {row.afternoonClose}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
