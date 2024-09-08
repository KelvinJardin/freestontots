import { Heading, Text } from "@/components";
import React from "react";
import { auth } from "@/app/auth";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function About() {
    return (
        <Text as="p" className="self-stretch text-center !text-[15px] leading-5">

        </Text>
    );
}
