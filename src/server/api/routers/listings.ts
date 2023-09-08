import { z } from "zod"

type ListingType = {
  id: string
  userId: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  price: number
  message: Array<{
    id: string
    fromUser: string
    fromUserName: string
    message: string
    listingId: string
  }>
}

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"

export const listingsRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.listing.findMany()
  }),
  get: publicProcedure
    .input(
      z.object({
        listingId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.listing.findUnique({
        where: {
          id: input.listingId,
        },
      })
    }),
  sendMessage: protectedProcedure
    .input(z.object({ message: z.string(), listingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          fromUser: ctx.auth.userId,
          fromUserName: ctx.auth.user?.username ?? "unknown",
          listingId: input.listingId,
          message: input.message,
        },
      })
      return message
    }),
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    const listing: ListingType[] = await ctx.prisma.listing.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        message: true,
      },
    })
    return listing.flatMap((item) => item.message)
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const listing = await ctx.prisma.listing.create({
        data: {
          ...input,
          userId: ctx.auth.userId,
        },
      })
      return listing
    }),
})
