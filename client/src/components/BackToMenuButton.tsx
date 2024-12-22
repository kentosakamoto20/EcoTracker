import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function BackToMenuButton() {
  return (
    <Link href="/">
      <Button variant="outline" className="mb-6">
        <HomeIcon className="h-4 w-4 mr-2" />
        メニューに戻る
      </Button>
    </Link>
  );
}
