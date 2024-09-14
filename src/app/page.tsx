import React from "react";
import { Metadata } from "next";

import Home from "@/app/Home";
import Gallery from "@/app/Gallery";
import OpenTimes from "@/app/OpenTimes";
import Section from "@/components/Section";
import { auth } from "@/app/auth";
import { PrismaClient, Prisma } from '@prisma/client';

type Content = Prisma.ContentGetPayload<{}>;

const prisma = new PrismaClient();

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
    "Open Times": <OpenTimes times={openTimes}/>,
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
                    authed={!!authed}
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
