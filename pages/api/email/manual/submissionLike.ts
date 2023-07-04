import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/prisma';
import sgMail from '@/utils/sendgrid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  try {
    const submission = await prisma.submission.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        listing: true,
      },
    });

    const msg = {
      to: submission?.user.email as string,
      from: {
        name: 'StreamConnect',
        email: process.env.SENDGRID_EMAIL as string,
      },
      templateId: process.env.SENDGRID_LIKE_TEMPLATE as string,
      dynamicTemplateData: {
        name: submission?.user.firstName,
        bounty_name: submission?.listing.title,
        link: `https://connect.streamprotocol.net/listings/bounties/${submission?.listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=submissionliked`,
      },
    };

    await sgMail.send(msg);
    return res.status(200).json({ message: 'Ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
}
