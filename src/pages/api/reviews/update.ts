import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { userId, reviewId, reviewer, content, stars } = req.body as {
        userId?: string;
        reviewId?: string;
        reviewer?: string;
        content?: string;
        stars?: number;
    };

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const requester = await prisma.user.findFirst({ where: { id: userId } });
    if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

    if (!reviewId) return res.status(400).json({ error: 'reviewId is required' });
    if (!reviewer || !reviewer.trim()) {
        return res.status(400).json({ error: 'Reviewer name is required' });
    }
    if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Review content is required' });
    }
    if (!stars || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
            reviewer: reviewer.trim(),
            content: content.trim(),
            stars,
        },
    });

    return res.status(200).json(review);
}
