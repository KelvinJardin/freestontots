"use client";

import React from "react";
import Carousel from "react-material-ui-carousel";
import Image from "next/image";

const images = [
  "img_inside1.jpg",
  "img_inside2.jpg",
  "img_inside3.jpg",
  "img_outside1.jpg",
  "img_outside2.jpg",
  "img_outside3.jpg",
  "img_outside4.jpg",
];

export default function Gallery() {
  return (
    <div className="w-full" style={{ maxWidth: 760, marginTop: "0.5rem" }}>
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(45,36,25,0.15)",
          border: "2px solid var(--clr-border)",
        }}
      >
        <Carousel
          animation="slide"
          navButtonsAlwaysVisible
          indicators
          navButtonsProps={{
            style: {
              backgroundColor: "rgba(0,0,0,0.35)",
              borderRadius: "50%",
            },
          }}
          indicatorContainerProps={{
            style: { marginTop: 12 },
          }}
        >
          {images.map((item, i) => (
            <div key={i} style={{ width: "100%", lineHeight: 0 }}>
              <Image
                src={`/images/${item}`}
                alt={`Gallery image ${i + 1}`}
                width={760}
                height={470}
                className="object-cover"
                style={{ width: "100%", height: "auto", display: "block" }}
                sizes="(max-width: 600px) 100vw, 760px"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
