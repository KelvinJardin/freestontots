import Header from "@/components/Header";
import { Heading } from "@/components";
import React from "react";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="relative mt-[-48px] flex h-[634px] flex-col items-center justify-center bg-[url(/images/img_home.png)] bg-cover bg-no-repeat px-10 py-[184px] md:h-auto md:py-5 sm:p-5 md:pt-[50px] sm:pt-[75px]">
        <Heading size="text4xl" as="h1" className="text-shadow-ts1 relative z-[1] !text-white-a700 sm:text-[25px]">
          Welcome to Freeston Tots
        </Heading>
        <Heading size="text2xl" as="h2" className="text-shadow-ts1 relative z-[1] !text-white-a700 sm:text-[25px]">
          Where Every Child Matters
        </Heading>
      </div>
    </div>
  );
}
