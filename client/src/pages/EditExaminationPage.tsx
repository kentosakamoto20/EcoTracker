import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ExaminationForm from "@/components/ExaminationForm";
import BackToMenuButton from "@/components/BackToMenuButton";

export default function EditExaminationPage() {
  const [location] = useLocation();
  const id = location.split("/")[2]; // /examinations/edit/[id]

  const { data: examination, isLoading } = useQuery({
    queryKey: [`/api/examinations/${id}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackToMenuButton />
      <h1 className="text-3xl font-bold">診察情報編集</h1>

      <Card>
        <CardHeader>
          <CardTitle>診察情報を編集</CardTitle>
        </CardHeader>
        <CardContent>
          <ExaminationForm examination={examination} />
        </CardContent>
      </Card>
    </div>
  );
}
