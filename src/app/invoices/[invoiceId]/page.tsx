import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Invoice from "./invoice";

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const { invoiceId: invoiceIdParam } = await params;
  const invoiceId = Number.parseInt(invoiceIdParam);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice id");
  }

  const [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.userId, userId), eq(Invoices.id, invoiceId)))
    .limit(1);

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
