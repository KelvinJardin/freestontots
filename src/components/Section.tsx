import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

interface sectionProps {
  style: React.CSSProperties,
  heading: string,
  subheading?: string,
  text?: string,
  children?: React.ReactNode
}

export default function Section({ style, heading, subheading, text, children }: sectionProps) {
  return (<div className="pt-[25px] pb-[25px] flex flex-col items-center" style={style} id={heading.replace(" ", "-")}>
    <div className="container-xs flex flex-col items-center gap-1.5 md:px-5">
      <Heading size="textxl" as="h2" className="!text-[30px]">
        {heading}
      </Heading>
      {
        subheading &&
        <Heading
          size="textlg"
          as="h3"
          className="text-center !text-[18px] !font-normal leading-[26px] !text-blue_gray-700_01 pb-[15px]"
        >
          {subheading}
        </Heading>
      }
      {
        text &&
        <Text as="p" className="self-stretch text-center !text-[15px] leading-5">
          {text}
        </Text>
      }
      {children}
    </div>
  </div>);
}
