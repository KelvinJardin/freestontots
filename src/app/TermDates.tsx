"use client";

import React from "react";

const rows = [
  [
    "Autumn",
    "04-09-2018",
    "-",
    "14-12-2018",
  ],
  [
    "Spring",
    "07-01-2019",
    "-",
    "05-04-2019",
  ],
  [
    "Summer",
    "29-04-2019",
    "-",
    "26-07-2019",
  ]
];

export default function TermDates() {

  return (
    <table>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="flex">
            {row.map((cell, index) => (
              <td
                key={index}
                className="flex w-[32%] items-center text-center justify-center px-5 text-[15px] sm:w-full"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
