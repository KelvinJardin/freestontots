"use client";

import React from "react";
import { OpenTimes } from '@prisma/client';

interface OpenTimesProps {
    times: OpenTimes[];
}

export default function OpenTimesContainer({times}: OpenTimesProps): React.ReactElement {
    return (
        <div className="mr-2 w-[82%] md:mr-0 md:w-full">
            <div className="flex flex-col">
                <table>
                    <thead>
                        <tr>
                            {
                                [
                                    "Day",
                                    "Morning",
                                    "Afternoon",
                                ].map((heading, index) => (
                                    <th
                                        key={index}
                                        className="w-[32%] items-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full"
                                    >
                                        {heading}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time: OpenTimes, index: number) => (
                            <tr key={index}>
                                {
                                    [
                                        time.day,
                                        `${time.morningOpen} - ${time.morningClose}`,
                                        `${time.afternoonOpen} - ${time.afternoonClose}`,
                                    ].map((cell, index) => (
                                        <td
                                            key={index}
                                            className="border-b-2 border-solid text-center border-gray-300 px-2 text-[13.13px] sm:w-full"
                                        >
                                            {cell}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
