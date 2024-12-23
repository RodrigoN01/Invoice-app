import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { db } from "@/db";
import { Invoices } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";

export default async function Dashboard() {
  const results = await db.select().from(Invoices);

  return (
    <main className='h-full'>
      <Container>
        <div className='flex justify-between mb-6'>
          <h1 className='text-3xl font-semibold'>Invoices</h1>
          <p>
            <Button className='inline-flex gap-2' variant='ghost' asChild>
              <Link href='/invoices/new'>
                <CirclePlus className='h-4 w-4' />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px] p-4'>Date</TableHead>
              <TableHead className='p-4'>Customer</TableHead>
              <TableHead className='p-4'>Email</TableHead>
              <TableHead className='text-center p-4'>Status</TableHead>
              <TableHead className='text-right p-4'>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className='p-0 font-medium text-left'>
                  <Link
                    href={`/invoices/${result.id}`}
                    className='block p-4 font-semibold'
                  >
                    {new Date(result.createTs).toLocaleDateString("en-UK")}
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-left'>
                  <Link
                    href={`/invoices/${result.id}`}
                    className='block p-4 font-semibold'
                  >
                    Philip j. Fry
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-left'>
                  <Link href={`/invoices/${result.id}`} className='block p-4'>
                    fry@planetexpress.com
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-center'>
                  <Link href={`/invoices/${result.id}`} className='block p-4'>
                    <Badge
                      className={cn(
                        "rounded-full capitalize",
                        result.status === "open" && "bg-blue-500",
                        result.status === "paid" && "bg-green-600",
                        result.status === "void" && "bg-zinc-700",
                        result.status === "uncollectible" && "bg-red-600"
                      )}
                    >
                      {result.status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className='p-0 text-right'>
                  <Link
                    href={`/invoices/${result.id}`}
                    className='block p-4 font-semibold'
                  >
                    ${(result.value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
