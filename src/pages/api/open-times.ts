import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';
import { OpenTimes } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;

    const requester = await prisma.user.findFirst({ where: { id: userId } });

    if (!requester?.admin) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
    }

    if (req.method === 'POST') {
        const { times }: { times: OpenTimes[] } = req.body;

        try {
            const updated = await Promise.all(
                times.map((time) =>
                    prisma.openTimes.upsert({
                        where: { id: time.id },
                        update: {
                            morningOpen: time.morningOpen,
                            morningClose: time.morningClose,
                            afternoonOpen: time.afternoonOpen,
                            afternoonClose: time.afternoonClose,
                        },
                        create: {
                            day: time.day,
                            morningOpen: time.morningOpen,
                            morningClose: time.morningClose,
                            afternoonOpen: time.afternoonOpen,
                            afternoonClose: time.afternoonClose,
                        },
                    })
                )
            );

            res.status(200).json(updated);
        } catch (error) {
            console.error('Error updating open times:', error);
            res.status(500).json({ error: 'Failed to update open times' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}