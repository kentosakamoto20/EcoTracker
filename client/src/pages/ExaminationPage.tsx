import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExaminationForm from "@/components/ExaminationForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExaminationPage() {
  const { data: examinations, isLoading } = useQuery<any[]>({
    queryKey: ["/api/examinations"],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Examinations</h1>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New Examination</TabsTrigger>
          <TabsTrigger value="history">Examination History</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Examination</CardTitle>
            </CardHeader>
            <CardContent>
              <ExaminationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Examination History</CardTitle>
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
                      <TableHead>Date</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {examinations?.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          {new Date(exam.examinationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{exam.pet?.name}</TableCell>
                        <TableCell>{exam.disease?.name}</TableCell>
                        <TableCell>{exam.notes}</TableCell>
                      </TableRow>
                    ))}
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
