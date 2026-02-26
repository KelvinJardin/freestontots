import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { sessionUserId, reviewer, content, stars } = req.body as {
        sessionUserId?: string;
        reviewer?: string;
        content?: string;
        stars?: number;
    };

    if (!sessionUserId) return res.status(401).json({ error: 'Unauthorized' });

    // Verify the user exists (any logged-in user can submit)
    const user = await prisma.user.findFirst({ where: { id: sessionUserId } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (!reviewer || !reviewer.trim()) {
        return res.status(400).json({ error: 'Reviewer name is required' });
    }
    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Review content is required' });
    }
    if (!stars || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    const review = await prisma.review.create({
        data: {
            reviewer: reviewer.trim(),
            content: content.trim(),
            stars,
            published: false,
        },
    });

    return res.status(200).json(review);
}
