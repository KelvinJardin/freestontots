import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const onlyPublished = req.query.published === 'true';
        const reviews = await prisma.review.findMany({
            where: onlyPublished ? { published: true } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(reviews);
    }

    if (req.method === 'DELETE') {
        const { userId, reviewId } = req.body as { userId?: string; reviewId?: string };
        if (!userId || !reviewId) {
            return res.status(400).json({ error: 'Missing userId or reviewId' });
        }

        const requester = await prisma.user.findFirst({ where: { id: userId } });
        if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

        await prisma.review.delete({ where: { id: reviewId } });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
        const { userId, reviewId, published, approve } = req.body as {
            userId?: string;
            reviewId?: string;
            published?: boolean;
            approve?: boolean;
        };
        if (!userId || !reviewId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const requester = await prisma.user.findFirst({ where: { id: userId } });
        if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

        const data = approve
            ? { approved: true, published: true }
            : { published };

        const review = await prisma.review.update({
            where: { id: reviewId },
            data,
        });
        return res.status(200).json(review);
    }

    res.setHeader('Allow', ['GET', 'DELETE', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
