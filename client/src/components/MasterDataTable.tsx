import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusIcon, Pencil, Trash2 } from "lucide-react";

type MasterDataType = "owners" | "pets" | "diseases" | "medications";

interface Props {
  type: MasterDataType;
  columns: { key: string; label: string }[];
}

export default function MasterDataTable({ type, columns }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<any[]>({
    queryKey: [`/api/${type}`],
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(`/api/${type}${editItem ? `/${editItem.id}` : ""}`, {
        method: editItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      setIsOpen(false);
      setEditItem(null);
      setFormData({});
      toast({
        title: "Success",
        description: `${type} has been ${editItem ? "updated" : "created"}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      queryClient.invalidateQueries({ queryKey: [`/api/${type}`] });
      toast({
        title: "Success",
        description: `${type} has been deleted.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold capitalize">{type}</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditItem(null);
              setFormData({});
            }}>
              <PlusIcon className="h-4 w-4 mr-2" />
              新規追加
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editItem ? "Edit" : "Add"} {type.slice(0, -1)}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(formData);
              }}
              className="space-y-4"
            >
              {columns.map((column) => (
                <div key={column.key} className="space-y-2">
                  <Label htmlFor={column.key}>{column.label}</Label>
                  <Input
                    id={column.key}
                    value={formData[column.key] || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [column.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "保存中..." : "保存"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>{item[column.key]}</TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditItem(item);
                        setFormData(item);
                        setIsOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
