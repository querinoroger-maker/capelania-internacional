import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { students } from "@db/schema";
import { eq, like, or, and, sql } from "drizzle-orm";

export const studentRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(students).orderBy(students.fullName);
  }),

  search: publicQuery
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const searchTerm = `%${input.query}%`;
      return db
        .select()
        .from(students)
        .where(
          or(
            like(students.fullName, searchTerm),
            like(students.email, searchTerm),
            like(students.city, searchTerm),
            like(students.certificateNumber, searchTerm),
            like(students.course, searchTerm)
          )
        )
        .orderBy(students.fullName);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(students)
        .where(eq(students.id, input.id));
      return result[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        fullName: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        city: z.string().optional().or(z.literal("")),
        state: z.string().optional().or(z.literal("")),
        country: z.string().optional().or(z.literal("")),
        course: z.string().optional().or(z.literal("")),
        completionDate: z.string().optional().or(z.literal("")),
        certificateNumber: z.string().optional().or(z.literal("")),
        status: z.string().optional().or(z.literal("")),
        notes: z.string().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const data = {
        fullName: input.fullName,
        email: input.email || null,
        phone: input.phone || null,
        city: input.city || null,
        state: input.state || null,
        country: input.country || null,
        course: input.course || null,
        completionDate: input.completionDate || null,
        certificateNumber: input.certificateNumber || null,
        status: input.status || "active",
        notes: input.notes || null,
      };
      const result = await db.insert(students).values(data);
      return { id: Number(result[0].insertId), ...data };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        fullName: z.string().min(1).optional(),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal("")),
        city: z.string().optional().or(z.literal("")),
        state: z.string().optional().or(z.literal("")),
        country: z.string().optional().or(z.literal("")),
        course: z.string().optional().or(z.literal("")),
        completionDate: z.string().optional().or(z.literal("")),
        certificateNumber: z.string().optional().or(z.literal("")),
        status: z.string().optional().or(z.literal("")),
        notes: z.string().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...updateData } = input;
      const data: Record<string, unknown> = {};
      if (updateData.fullName !== undefined) data.fullName = updateData.fullName;
      if (updateData.email !== undefined) data.email = updateData.email || null;
      if (updateData.phone !== undefined) data.phone = updateData.phone || null;
      if (updateData.city !== undefined) data.city = updateData.city || null;
      if (updateData.state !== undefined) data.state = updateData.state || null;
      if (updateData.country !== undefined) data.country = updateData.country || null;
      if (updateData.course !== undefined) data.course = updateData.course || null;
      if (updateData.completionDate !== undefined) data.completionDate = updateData.completionDate || null;
      if (updateData.certificateNumber !== undefined) data.certificateNumber = updateData.certificateNumber || null;
      if (updateData.status !== undefined) data.status = updateData.status || "active";
      if (updateData.notes !== undefined) data.notes = updateData.notes || null;

      await db.update(students).set(data).where(eq(students.id, id));
      return { id, ...data };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),
});
