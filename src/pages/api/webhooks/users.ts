import type { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WebhookRequiredHeaders } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";

const webhookSecret: string = process.env.USERS_WEBHOOK_SECRET ?? "";

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }

  const eventType = evt.type;
  if (eventType === "user.created") {
    const userFromClerk = evt.data;

    // Insert the new user into your database using Prisma
    const prisma = new PrismaClient();
    try {
      const newUser = await prisma.user.create({
        data: {
          id: userFromClerk.id,
          // assuming any account used to sign up will have a valid email address
          email: userFromClerk.email_addresses[0]!.email_address,
          firstName: userFromClerk.first_name,
          lastName: userFromClerk.last_name,
        },
      });
    } catch (error) {
    } finally {
      await prisma.$disconnect(); // Disconnect the Prisma client
    }

    res.status(201).json({});
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
