import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
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

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024,
        filter: ({ mimetype }) => !!mimetype && mimetype.startsWith('image/'),
    });

    let fields: formidable.Fields;
    let files: formidable.Files;
    try {
        [fields, files] = await form.parse(req);
    } catch {
        return res.status(400).json({ error: 'Failed to parse form data' });
    }

    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const postId = Array.isArray(fields.postId) ? fields.postId[0] : fields.postId;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!postId || !title || !content) {
        return res.status(400).json({ error: 'postId, title, and content are required' });
    }

    const requester = await prisma.user.findFirst({ where: { id: userId } });
    if (!requester?.admin) return res.status(403).json({ error: 'Unauthorized' });

    await prisma.blogPost.update({
        where: { id: postId },
        data: { title, content },
    });

    const fileArray = Array.isArray(files.images)
        ? files.images
        : files.images
        ? [files.images]
        : [];

    for (const file of fileArray) {
        const ext = path.extname(file.originalFilename || '.jpg');
        const uniqueName = `blog-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const dest = path.join(uploadDir, uniqueName);
        fs.renameSync(file.filepath, dest);

        await prisma.blogImage.create({
            data: {
                postId,
                filename: uniqueName,
                url: `/uploads/${uniqueName}`,
            },
        });
    }

    const updated = await prisma.blogPost.findUnique({
        where: { id: postId },
        include: { images: true },
    });

    return res.status(200).json(updated);
}
