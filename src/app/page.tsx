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

const offsetColour = "#C7E2EB";

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
