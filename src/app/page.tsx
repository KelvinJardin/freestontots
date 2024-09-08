import React from "react";
import { Metadata } from "next";

import Home from "@/app/Home";
import Gallery from "@/app/Gallery";
import OpenTimes from "@/app/OpenTimes";
import Section from "@/components/Section";
import { auth } from "@/app/auth";
import { PrismaClient } from '@prisma/client';

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

  const sectionsDetails = contents.reduce((acc, content) => {
    acc[content.heading] = content;
    return acc;
  }, {});

  const withContent = {
    "Gallery": <Gallery />,
    "Open Times": <OpenTimes openTimes={openTimes}/>,
  };

  return (
      <div className="w-full bg-white-a700">
        <div>
          <Home />
          {
            sections.map(
              (heading, index) => {
                const Content = withContent[heading];

                return <Section
                    key={index}
                    style={{ backgroundColor: index % 2 === 0 ? offsetColour : "white" }}
                    heading={heading}
                    content={sectionsDetails[heading]}
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
