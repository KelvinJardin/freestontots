import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

interface UpdateContentRequest {
    id: string;
    heading: string;
    subHeading?: string;
    text?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    const requester = await prisma.user.findFirst({where: {id: userId}});

    if (!requester?.admin) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        const { id = '', heading, subHeading, text }: UpdateContentRequest = req.body;

        try {
            const updatedContent = await prisma.content.upsert({
                where: { id }, // Use an empty string for id if not provided
                update: { heading, subHeading, text },
                create: { heading, subHeading, text },
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
