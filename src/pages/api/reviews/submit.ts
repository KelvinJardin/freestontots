import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';
import { sendNewReviewNotification } from '@/lib/email';

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

    // Notify admins — fire-and-forget so email failure never blocks the response
    prisma.user
        .findMany({ where: { admin: true }, select: { email: true } })
        .then((admins) => {
            const emails = admins.map((a) => a.email).filter(Boolean) as string[];
            return sendNewReviewNotification(emails, {
                reviewer: review.reviewer,
                content: review.content,
                stars: review.stars,
            });
        })
        .catch((err) => console.error('[review notification]', err));

    return res.status(200).json(review);
}
