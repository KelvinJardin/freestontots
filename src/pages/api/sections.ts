import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/db';

const FIXED_SECTIONS = ["Open Times", "Gallery", "Contact"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { userId, action } = req.body;

  const requester = await prisma.user.findFirst({ where: { id: userId } });

  if (!requester?.admin) {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }

  try {
    if (action === 'reorder') {
      const { orderedHeadings } = req.body as { orderedHeadings: string[] };

      if (!Array.isArray(orderedHeadings)) {
        res.status(400).json({ error: 'orderedHeadings must be an array' });
        return;
      }

      await Promise.all(
        orderedHeadings.map((heading, index) =>
          prisma.content.upsert({
            where: { heading },
            update: { order: index },
            create: { heading, order: index },
          })
        )
      );

      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'delete') {
      const { heading } = req.body as { heading: string };

      if (!heading) {
        res.status(400).json({ error: 'heading is required' });
        return;
      }

      if (FIXED_SECTIONS.includes(heading)) {
        res.status(400).json({ error: `Cannot delete fixed section: ${heading}` });
        return;
      }

      await prisma.content.delete({ where: { heading } });

      res.status(200).json({ ok: true });
      return;
    }

    if (action === 'create') {
      const { heading, subHeading, text } = req.body as {
        heading: string;
        subHeading?: string;
        text?: string;
      };

      if (!heading) {
        res.status(400).json({ error: 'heading is required' });
        return;
      }

      // Find the current max order to place the new section at the end
      const maxOrderResult = await prisma.content.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      const nextOrder = (maxOrderResult?.order ?? -1) + 1;

      const newContent = await prisma.content.create({
        data: {
          heading,
          subHeading: subHeading ?? null,
          text: text ?? null,
          order: nextOrder,
        },
      });

      res.status(200).json(newContent);
      return;
    }

    res.status(400).json({ error: `Unknown action: ${action}` });
  } catch (error) {
    console.error(`Error in /api/sections (action=${action}):`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
