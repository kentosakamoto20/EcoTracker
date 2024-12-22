import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StethoscopeIcon, FileTextIcon, DatabaseIcon, HomeIcon } from "lucide-react";

export default function MenuPage() {
  const menuItems = [
    {
      title: "診察情報登録",
      icon: StethoscopeIcon,
      href: "/examinations",
      description: "新規診察の登録や診察履歴の確認ができます",
    },
    {
      title: "請求書発行",
      icon: FileTextIcon,
      href: "/invoices",
      description: "請求書の作成や管理ができます",
    },
    {
      title: "マスタ登録",
      icon: DatabaseIcon,
      href: "/master-data",
      description: "飼い主、ペット、病名、薬名の管理ができます",
    },
    {
      title: "ダッシュボード",
      icon: HomeIcon,
      href: "/dashboard",
      description: "システム全体の状況を確認できます",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">メニュー</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="block">
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <item.icon className="h-6 w-6" />
                      <span>{item.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <Button className="w-full">
                      選択
                    </Button>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
