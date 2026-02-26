import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const onlyPublished = req.query.published === 'true';
        const posts = await prisma.blogPost.findMany({
            where: onlyPublished ? { published: true } : undefined,
            include: { images: true },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(posts);
    }

    if (req.method === 'DELETE') {
        const { userId, postId } = req.body as { userId?: string; postId?: string };
        if (!userId || !postId) return res.status(400).json({ error: 'Missing userId or postId' });

        const requester = await prisma.user.findFirst({ where: { id: userId } });
        if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

        await prisma.blogPost.delete({ where: { id: postId } });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
        const { userId, postId, published } = req.body as {
            userId?: string;
            postId?: string;
            published?: boolean;
        };
        if (!userId || !postId || published === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const requester = await prisma.user.findFirst({ where: { id: userId } });
        if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

        const post = await prisma.blogPost.update({
            where: { id: postId },
            data: { published },
            include: { images: true },
        });
        return res.status(200).json(post);
    }

    res.setHeader('Allow', ['GET', 'DELETE', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
