import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { put } from '@vercel/blob';
import prisma from '@/app/db';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const form = formidable({
        uploadDir: '/tmp',
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: ({ mimetype }) => !!mimetype && mimetype.startsWith('image/'),
    });

    let fields: formidable.Fields;
    let files: formidable.Files;
    try {
        [fields, files] = await form.parse(req);
    } catch {
        return res.status(400).json({ error: 'Failed to parse upload' });
    }

    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const requester = await prisma.user.findFirst({ where: { id: userId } });
    if (!requester?.admin) return res.status(403).json({ error: 'Forbidden' });

    const fileArray = Array.isArray(files.file) ? files.file : files.file ? [files.file] : [];
    if (fileArray.length === 0) return res.status(400).json({ error: 'No file provided' });

    const file = fileArray[0];
    const ext = path.extname(file.originalFilename || '.jpg');
    const uniqueName = `content/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const buffer = fs.readFileSync(file.filepath);
    const blob = await put(uniqueName, buffer, {
        access: 'public',
        contentType: file.mimetype ?? 'image/jpeg',
    });
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ url: blob.url });
}
