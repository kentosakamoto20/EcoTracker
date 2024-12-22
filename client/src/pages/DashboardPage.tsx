import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  UserIcon,
  PawPrintIcon,
  StethoscopeIcon,
  BanknoteIcon,
} from "lucide-react";
import BackToMenuButton from "@/components/BackToMenuButton";

export default function DashboardPage() {
  const { data: owners, isLoading: loadingOwners } = useQuery<any[]>({
    queryKey: ["/api/owners"],
  });

  const { data: pets, isLoading: loadingPets } = useQuery<any[]>({
    queryKey: ["/api/pets"],
  });

  const { data: examinations, isLoading: loadingExaminations } = useQuery<any[]>({
    queryKey: ["/api/examinations"],
  });

  const { data: invoices, isLoading: loadingInvoices } = useQuery<any[]>({
    queryKey: ["/api/invoices"],
  });

  const stats = [
    {
      title: "飼い主数",
      value: owners?.length ?? 0,
      icon: UserIcon,
      loading: loadingOwners,
    },
    {
      title: "ペット数",
      value: pets?.length ?? 0,
      icon: PawPrintIcon,
      loading: loadingPets,
    },
    {
      title: "診察件数",
      value: examinations?.length ?? 0,
      icon: StethoscopeIcon,
      loading: loadingExaminations,
    },
    {
      title: "未払い請求書",
      value: invoices?.filter((i: any) => !i.paid).length ?? 0,
      icon: BanknoteIcon,
      loading: loadingInvoices,
    },
  ];

  return (
    <div className="space-y-6">
      <BackToMenuButton />
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      <BackToMenuButton /> {/* Added Back button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingExaminations ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {examinations?.slice(0, 5).map((exam: any) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">
                      Examination #{exam.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exam.examinationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}