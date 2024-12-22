import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import BackToMenuButton from "@/components/BackToMenuButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import { BanknoteIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function InvoicePage() {
  const { data: invoices, isLoading } = useQuery<any[]>({
    queryKey: ["/api/invoices"],
  });

  const { data: owners } = useQuery<any[]>({
    queryKey: ["/api/owners"],
  });

  return (
    <div className="space-y-6">
      <BackToMenuButton />
      <h1 className="text-3xl font-bold">Invoices</h1>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate">請求書作成</TabsTrigger>
          <TabsTrigger value="history">請求履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>新規請求書作成</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices?.map((invoice) => {
                      const owner = owners?.find(
                        (o) => o.id === invoice.ownerId
                      );
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell>#{invoice.id}</TableCell>
                          <TableCell>{owner?.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <BanknoteIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                              ${invoice.totalAmount}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {invoice.paid ? (
                                <>
                                  <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                                  <span className="text-green-500">Paid</span>
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="h-4 w-4 mr-1 text-red-500" />
                                  <span className="text-red-500">Pending</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
