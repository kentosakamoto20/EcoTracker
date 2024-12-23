import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExaminationForm from "@/components/ExaminationForm";
import ExaminationFilter from "@/components/ExaminationFilter";
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
import { PencilIcon } from "lucide-react";
import { useLocation } from "wouter";

interface Filters {
  petId?: string;
  diseaseId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function ExaminationPage() {
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<Filters>({});

  const { data: examinations, isLoading } = useQuery<any[]>({
    queryKey: ["/api/examinations", filters],
    queryFn: async ({ queryKey }) => {
      const [_, filters] = queryKey;
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`/api/examinations?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch examinations");
      return response.json();
    },
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
            <CardContent className="space-y-6">
              <ExaminationFilter onFilterChange={setFilters} />
              
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
                      <TableHead>操作</TableHead>
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
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/examinations/edit/${exam.id}`)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
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