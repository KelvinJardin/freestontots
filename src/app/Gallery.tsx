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
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 30px rgba(0,0,0,0.12)",
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
            <div
              key={i}
              style={{ position: "relative", width: "100%", paddingBottom: "62%" }}
            >
              <Image
                src={`/images/${item}`}
                alt={`Gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 760px"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
