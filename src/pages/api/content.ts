import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateContentRequest {
    id: string;
    heading: string;
    subHeading?: string;
    text?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { id, heading, subHeading, text }: UpdateContentRequest = req.body;

        try {
            const updatedContent = await prisma.content.update({
                where: { id },
                data: { heading, subHeading, text },
            });
            res.status(200).json(updatedContent);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(500).json({ error: 'Failed to update content' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
