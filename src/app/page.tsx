import React from "react";
import { Metadata } from "next";

import Home from "@/app/Home";
import About from "@/app/About";
import Mission from "@/app/Mission";
import Gallery from "@/app/Gallery";
import OpenTimes from "@/app/OpenTimes";
import ContactUs from "@/app/ContactUs";
import TermDates from "@/app/TermDates";
import Map from "@/app/Map";
import Section from "@/components/Section";

export const metadata: Metadata = {
  title: "Freeston Tots",
  description: "Freeston Tots Preschool"
};

const offsetColour = "#C7E2EB";

const sections = [
  {
    heading: "About",
    content: About
  },
  {
    heading: "Mission",
    content: Mission
  },
  {
    heading: "Open Times",
    subheading: "We provide 2 different sessions each weekday",
    content: OpenTimes
  },
  {
    heading: "Term Dates",
    subheading: "2021/2022",
    content: TermDates
  },
  {
    heading: "Gallery",
    content: Gallery
  },
  {
    heading: "Contact",
    content: ContactUs
  }
];

export default function FreestonTotsPage() {
  return (
    <div className="w-full bg-white-a700">
      <div>
        <Home />
        {
          sections.map(
            ({ content: SectionContent, ...sectionProps }, index) =>
              <Section
                key={index}
                style={{ backgroundColor: index % 2 === 0 ? offsetColour : "white" }}
                {...sectionProps}
              >
                <SectionContent />
              </Section>
          )
        }
        {/*<Map />*/}
      </div>
    </div>
  );
}
