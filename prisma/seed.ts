import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const sections = [
        {
            heading: 'About',
            subHeading: 'Where Every Child Matters',
            text: 'We are a small, friendly preschool dedicated to providing high-quality care and education for children aged two to five years, with funded places available.\n\nWe ensure high ratios of adult to child staffing, as we strongly believe in the value of adult interaction and support.\n\nWe work collaboratively with families and external agencies to meet the individual needs of every child.',
        },
        {
            heading: 'Mission',
            subHeading: null,
            text: 'We aim to create a safe, nurturing, bright and educational environment where children develop confidence and progress across all areas of learning. Our staff model enthusiasm for learning and provide real-life experiences to inspire every child\'s aspirations.',
        },
        {
            heading: 'Open Times',
            subHeading: null,
            text: null,
        },
        {
            heading: 'Term Dates',
            subHeading: 'Term Dates 2025/2026',
            text: 'Autumn (1): 01/09/2025 – 17/10/2025\nClosed: 20/10/2025 – 31/10/2025\n\nAutumn (2): 03/11/2025 – 19/12/2025\nClosed: 22/12/2025 – 02/01/2026\n\nSpring (1): 05/01/2026 – 13/02/2026\nClosed: 16/02/2026 – 20/02/2026\n\nSpring (2): 23/02/2026 – 02/04/2026\nClosed: 03/04/2026 – 10/04/2026',
        },
        {
            heading: 'Gallery',
            subHeading: null,
            text: null,
        },
        {
            heading: 'Contact',
            subHeading: 'Get in Touch',
            text: 'Phone: 07855072659\nEmail: freestontots@outlook.com\nAddress: Rear of 1 Freeston Street, Cleethorpes, DN35 7LY\n\nFollow us on Facebook for updates on our learning activities.',
        },
    ];

    for (const section of sections) {
        await prisma.content.upsert({
            where: { heading: section.heading },
            update: {},
            create: section,
        });
    }

    console.log('Seeded content sections.');

    const openTimes = [
        { day: 'Monday',    morningOpen: '08:30', morningClose: '11:30', afternoonOpen: '12:30', afternoonClose: '15:30' },
        { day: 'Tuesday',   morningOpen: '08:30', morningClose: '11:30', afternoonOpen: '12:30', afternoonClose: '15:30' },
        { day: 'Wednesday', morningOpen: '08:30', morningClose: '11:30', afternoonOpen: '12:30', afternoonClose: '15:30' },
        { day: 'Thursday',  morningOpen: '08:30', morningClose: '11:30', afternoonOpen: '12:30', afternoonClose: '15:30' },
        { day: 'Friday',    morningOpen: '08:30', morningClose: '11:30', afternoonOpen: '12:30', afternoonClose: '15:30' },
    ];

    await prisma.openTimes.deleteMany();
    await prisma.openTimes.createMany({ data: openTimes });

    console.log('Seeded open times.');

    // Seed existing static images as gallery images
    const staticImages = [
        'img_inside1.jpg',
        'img_inside2.jpg',
        'img_inside3.jpg',
        'img_outside1.jpg',
        'img_outside2.jpg',
        'img_outside3.jpg',
        'img_outside4.jpg',
    ];

    for (const filename of staticImages) {
        await prisma.galleryImage.upsert({
            where: { filename },
            update: {},
            create: {
                filename,
                url: `/images/${filename}`,
                inGallery: true,
            },
        });
    }

    console.log('Seeded gallery images.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });