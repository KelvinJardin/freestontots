import { Heading, Img, Text } from "./..";
import Link from "next/link";
import React from "react";

interface Props {
  className?: string;
}

export default function Header({ ...props }: Props) {
  return (
    <>
      <header
        {...props}
        className={`${props.className} flex sm:flex-col justify-between items-start gap-5 px-[26px] sm:px-5 z-[2] bg-white-a700 relative md:h-[100px] sm:h-[110px]`}
      >
        <div className="mb-6 flex items-center gap-1">
          <Img
            src="img_bare_logo_png.png"
            width={80}
            height={80}
            alt="Barelogopng"
            className="h-[80px] w-[80px] object-cover sm:w-[40px] sm:h-[40px]"
          />
          <Heading size="headingmd" as="h1" className="text-shadow-ts self-end !text-gray-700 sm:self-auto">
            Freeston Tots
          </Heading>
        </div>
        <ul className="!mr-[70px] flex flex-wrap gap-[25px] self-center md:mr-0">
          {
            [
              "About",
              "Gallery",
              "Contact"
            ].map((text, index) => (
              <li className={'bg-white-a700 rounded'} key={index}>
                <Link key={index} href={`#${text}`} className="text-shadow-ts">
                  <Text as="p" className="!text-[15px] !text-blue_gray-700">
                    {text}
                  </Text>
                </Link>
              </li>
            ))
          }
        </ul>
      </header>
    </>
  );
}
