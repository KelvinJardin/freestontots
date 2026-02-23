"use client";

import React, { useState } from "react";
import { OpenTimes } from '@prisma/client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditOpenTimesModal from "@/components/EditOpenTimesModal";

interface OpenTimesProps {
    times: OpenTimes[];
    user?: { id?: string; admin?: boolean };
}

export default function OpenTimesContainer({ times, user }: OpenTimesProps): React.ReactElement {
    const [rows, setRows] = useState<OpenTimes[]>(times);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="mr-2 w-[82%] md:mr-0 md:w-full">
            <div className="flex flex-col">
                <table>
                    <thead>
                        <tr>
                            {["Day", "Morning", "Afternoon"].map((heading, index) => (
                                <th
                                    key={index}
                                    className="w-[32%] items-center justify-center border-b-2 border-solid border-gray-300 px-2 text-[13.13px] sm:w-full"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((time: OpenTimes, index: number) => (
                            <tr key={index}>
                                {[
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
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {user?.admin && (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="mt-3 self-end text-sm text-gray-500 hover:text-gray-800"
                    >
                        <EditOutlinedIcon fontSize="small" /> Edit times
                    </button>
                )}
            </div>
            {user?.admin && (
                <EditOpenTimesModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    times={rows}
                    onSave={setRows}
                    user={user}
                />
            )}
        </div>
    );
}
