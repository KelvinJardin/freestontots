import React from "react";
import { Metadata } from "next";

import Home from "@/app/Home";
import Gallery from "@/app/Gallery";
import OpenTimes from "@/app/OpenTimes";
import Section from "@/components/Section";
import { auth } from "@/app/auth";
import { Content } from '@prisma/client';
import prisma from '@/app/db';

export const metadata: Metadata = {
  title: "Freeston Tots",
  description: "Freeston Tots Preschool"
};

const offsetColour = "#f0f9ff";

const sections = [
  "About",
  "Mission",
  "Open Times",
  "Term Dates",
  "Gallery",
  "Contact",
];

export default async function FreestonTotsPage() {
  const session = await auth();
  const authed = session?.user;
  const user = authed ? await prisma.user.findFirst({where: {id: authed?.id}}) : null;

  const contents = await prisma.content.findMany({
    where: {
      heading: {
        in: sections,
      },
    },
  });

  const openTimes = await prisma.openTimes.findMany();

  type ContentMap = {
    [key: string]: typeof contents[number]; // This sets the type of each entry to match the `contents` array items
  };

  const sectionsDetails = contents.reduce((acc: ContentMap, content: Content) => {
    acc[content.heading] = content;
    return acc;
  }, {});

  const withContent: {[key: string]: React.JSX.Element} = {
    "Gallery": <Gallery />,
    "Open Times": <OpenTimes times={openTimes} user={{id: user?.id, admin: user?.admin}}/>,
    "Contact": (
      <a
        href="https://www.facebook.com/profile.php?id=100057498187436"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "0.5rem",
          backgroundColor: "#1877F2",
          color: "#fff",
          padding: "0.55rem 1.25rem",
          borderRadius: "9999px",
          fontSize: "0.88rem",
          fontWeight: 600,
          fontFamily: "Inter, sans-serif",
          textDecoration: "none",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
        Find us on Facebook
      </a>
    ),
  };

  return (
      <div className="w-full bg-white-a700">
        <div>
          <Home />
          {
            sections.map(
              (heading, index) => {
                const Content = withContent[heading];
                const sectionContent = sectionsDetails[heading] ?? {
                    heading,
                    subHeading: "",
                    text: "",
                };

                return <Section
                    key={index}
                    style={{ backgroundColor: index % 2 === 0 ? offsetColour : "white" }}
                    heading={heading}
                    content={sectionContent}
                    user={{id: user?.id, admin: user?.admin}}
                    updatable={heading !== "Gallery"}
                >
                  {Content}
                </Section>
              }
            )
          }
          {/*<Map />*/}
        </div>
      </div>
  );
}
