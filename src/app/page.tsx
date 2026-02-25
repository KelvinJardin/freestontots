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

const sectionBgs = [
  "var(--clr-bg)",
  "var(--clr-surface-alt)",
  "var(--clr-bg)",
  "var(--clr-surface-alt)",
  "var(--clr-bg)",
  "var(--clr-surface-alt)",
];

const sections = [
  "About",
  "Mission",
  "Open Times",
  "Term Dates",
  "Gallery",
  "Contact",
];

// Wave divider: fill matches the NEXT section's background color
function WaveDivider({ fill }: { fill: string }) {
  return (
    <div style={{ overflow: "hidden", lineHeight: 0, width: "100%" }}>
      <svg
        viewBox="0 0 1200 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 60 }}
      >
        <path
          d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

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
    [key: string]: typeof contents[number];
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
          fontFamily: "'Lato', sans-serif",
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
    <div className="w-full" style={{ backgroundColor: "var(--clr-bg)" }}>
      <Home />
      {sections.map((heading, index) => {
        const SectionContent = withContent[heading];
        const sectionContent = sectionsDetails[heading] ?? {
          heading,
          subHeading: "",
          text: "",
        };
        const currentBg = sectionBgs[index];
        const nextBg = sectionBgs[index + 1];

        return (
          <React.Fragment key={index}>
            <Section
              style={{ backgroundColor: currentBg }}
              heading={heading}
              content={sectionContent}
              user={{id: user?.id, admin: user?.admin}}
              updatable={heading !== "Gallery"}
            >
              {SectionContent}
            </Section>
            {nextBg && (
              <WaveDivider fill={nextBg} />
            )}
          </React.Fragment>
        );
      })}
      {/*<Map />*/}

      <footer
        style={{
          backgroundColor: "#2D2419",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--clr-bg)",
            fontSize: "0.82rem",
            fontFamily: "'Lato', sans-serif",
            opacity: 0.75,
          }}
        >
          &copy; 2025 Freeston Tots
        </p>
      </footer>
    </div>
  );
}
