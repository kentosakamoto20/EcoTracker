import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { 
  HomeIcon, 
  StethoscopeIcon, 
  FileTextIcon, 
  DatabaseIcon, 
  LogOutIcon 
} from "lucide-react";

const navItems = [
  { href: "/examinations", label: "診察情報登録", icon: StethoscopeIcon },
  { href: "/invoices", label: "請求書発行", icon: FileTextIcon },
  { href: "/master-data", label: "マスタ登録", icon: DatabaseIcon },
];

export default function Navigation() {
  const { logout } = useUser();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary mr-8">
              動物病院管理
            </h1>
            <div className="flex space-x-4">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <a
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location === href
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600"
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </div>
    </nav>
  );
}
