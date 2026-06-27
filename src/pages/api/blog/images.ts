import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import { del } from '@vercel/blob';
import prisma from '@/app/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { userId, imageId } = req.body as { userId?: string; imageId?: string };
    if (!userId || !imageId) return res.status(400).json({ error: 'Missing userId or imageId' });

    const requester = await prisma.user.findFirst({ where: { id: userId } });
    if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

    const image = await prisma.blogImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    if (image.url.startsWith('/uploads/')) {
        // Legacy local file — delete from disk
        const filePath = path.join(process.cwd(), 'uploads', image.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } else {
        // Vercel Blob URL
        await del(image.url);
    }

    await prisma.blogImage.delete({ where: { id: imageId } });

    return res.status(200).json({ success: true });
}
