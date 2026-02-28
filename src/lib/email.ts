import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM ?? 'noreply@example.com';

export async function sendNewReviewNotification(
    adminEmails: string[],
    review: { reviewer: string; content: string; stars: number }
) {
    if (adminEmails.length === 0) return;

    const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
    const snippet = review.content.length > 200
        ? review.content.slice(0, 200) + '…'
        : review.content;

    await resend.emails.send({
        from,
        to: adminEmails,
        subject: `New review submitted by ${review.reviewer}`,
        text: [
            `A new review is waiting for your approval.`,
            ``,
            `Reviewer: ${review.reviewer}`,
            `Rating:   ${stars} (${review.stars}/5)`,
            ``,
            snippet,
            ``,
            `Log in to approve or reject it.`,
            `https://freestontots.co.uk/#Reviews`
        ].join('\n'),
    });
}
