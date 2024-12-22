import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileDownIcon, Loader2 } from "lucide-react";

export default function InvoiceGenerator() {
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: owners, isLoading: loadingOwners } = useQuery<any[]>({
    queryKey: ["/api/owners"],
  });

  const { data: examinations } = useQuery<any[]>({
    queryKey: ["/api/examinations"],
    enabled: !!selectedOwner,
  });

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch(`/api/invoices/${selectedOwner}/download`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }

      // Create a blob from the response and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${selectedOwner}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Invoice has been generated and downloaded.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loadingOwners) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Owner</label>
          <Select
            value={selectedOwner}
            onValueChange={setSelectedOwner}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an owner" />
            </SelectTrigger>
            <SelectContent>
              {owners?.map((owner) => (
                <SelectItem key={owner.id} value={owner.id.toString()}>
                  {owner.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOwner && examinations && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-medium">Examinations</h3>
              {examinations
                .filter((exam) => exam.petId === parseInt(selectedOwner))
                .map((exam) => (
                  <div
                    key={exam.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
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

            <Button
              onClick={handleGenerateInvoice}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <FileDownIcon className="h-4 w-4 mr-2" />
              )}
              Generate Invoice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
