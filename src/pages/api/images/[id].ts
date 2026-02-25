import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id: string };
    const { userId } = req.body ?? {};

    const requester = userId ? await prisma.user.findFirst({ where: { id: userId } }) : null;
    if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

    if (req.method === 'DELETE') {
        const image = await prisma.galleryImage.findUnique({ where: { id } });
        if (!image) return res.status(404).json({ error: 'Not found' });

        // Only delete file if it's in uploads/ (not legacy /images/ static files)
        if (image.url.startsWith('/uploads/')) {
            const filePath = path.join(process.cwd(), 'public', image.url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await prisma.galleryImage.delete({ where: { id } });
        return res.status(200).json({ success: true });
    }

    if (req.method === 'PATCH') {
        const { inGallery } = req.body as { inGallery: boolean };
        const updated = await prisma.galleryImage.update({
            where: { id },
            data: { inGallery },
        });
        return res.status(200).json(updated);
    }

    res.setHeader('Allow', ['DELETE', 'PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
