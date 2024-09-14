'use client';

import React, { useState } from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditContentModal from "@/components/EditContentModal";
import { Content } from '@prisma/client';

interface SectionProps {
    style: React.CSSProperties,
    heading: string,
    content: Content,
    children?: React.ReactNode,
    authed: boolean,
    updatable: boolean,
}

export default function Section({style, heading, content: sectionContent, children, authed, updatable}: SectionProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [content, setContent] = useState<Content | null | undefined>(sectionContent);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const onSave = async (content: Content) => setContent(content);

    const headingContent = authed && updatable ? (
        <button onClick={handleOpenModal}>
            {content?.heading || heading} <EditOutlinedIcon />
        </button>
    ) : (
        content?.heading || heading
    );

    return (<div
        className="pt-[25px] pb-[25px] flex flex-col items-center"
        style={style}
        id={(content?.heading || heading).replace(" ", "-")}
    >
        <div className="container-xs flex flex-col items-center gap-1.5 md:px-5">
            <Heading size="textxl" as="h2" className="!text-[30px]">
                {headingContent}
            </Heading>
            {
                content?.subHeading &&
				<Heading
					size="textlg"
					as="h3"
					className="text-center !text-[18px] !font-normal leading-[26px] !text-blue_gray-700_01 pb-[15px]"
				>
                    {content?.subHeading}
				</Heading>
            }
            {
                content?.text &&
				<Text as="p" className="self-stretch text-center !text-[15px] leading-5">
                    {content?.text.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br/>
                        </React.Fragment>
                    ))}
				</Text>
            }
            {children}
        </div>

        {updatable && <EditContentModal
			open={modalOpen}
			onClose={handleCloseModal}
			content={content}
			onSave={onSave}
		/>}
    </div>);
}
