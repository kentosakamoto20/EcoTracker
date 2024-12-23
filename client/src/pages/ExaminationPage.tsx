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
import BackToMenuButton from "@/components/BackToMenuButton";

export default function ExaminationPage() {
  const { data: examinations, isLoading } = useQuery<any[]>({
    queryKey: ["/api/examinations"],
  });

  return (
    <div className="space-y-6">
      <BackToMenuButton />
      <h1 className="text-3xl font-bold">診察情報</h1>

      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">新規診察</TabsTrigger>
          <TabsTrigger value="history">診察履歴</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>新規診察登録</CardTitle>
            </CardHeader>
            <CardContent>
              <ExaminationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>診察履歴一覧</CardTitle>
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
                      <TableHead>診察日</TableHead>
                      <TableHead>ペット名</TableHead>
                      <TableHead>病名</TableHead>
                      <TableHead>備考</TableHead>
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