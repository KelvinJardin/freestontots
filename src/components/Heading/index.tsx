import React from "react";

const sizes = {
  textlg: "text-[16px] font-medium not-italic",
  textxl: "text-[32px] font-medium md:text-[30px] sm:text-[28px]",
  text2xl: "text-[33px] font-medium md:text-[31px] sm:text-[29px]",
  text3xl: "text-[46px] font-medium md:text-[42px] sm:text-[36px]",
  text4xl: "text-[64px] font-medium md:text-[48px]",
  headingxs: "text-[13px] font-bold",
  headings: "text-[14px] font-bold",
  headingmd: "text-[49px] font-bold md:text-[45px] sm:text-[39px]",
};

export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "text2xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component className={`text-blue_gray-900 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
