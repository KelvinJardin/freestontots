'use client';

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
]

export default function Gallery() {
  return (
    <Carousel sx={{width: '650px', height: '550px'}}>
      {
        images.map( (item, i) =>
          <Image
            key={i}
            src={`/images/${item}`}
            alt={`image ${i}`}
            width={650}
            height={550}
          />
        )
      }
    </Carousel>
  );
}
