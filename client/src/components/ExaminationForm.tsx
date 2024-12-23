import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  petId: z.string().min(1, "ペットを選択してください"),
  diseaseId: z.string().min(1, "病名を選択してください"),
  examinationDate: z.string().min(1, "診察日を選択してください"),
  notes: z.string().optional(),
  medications: z.array(z.object({
    medicationId: z.string().min(1, "薬を選択してください"),
    quantity: z.string().min(1, "数量を入力してください"),
  })),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  examination?: any;
}

export default function ExaminationForm({ examination }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: pets } = useQuery<any[]>({
    queryKey: ["/api/pets"],
  });

  const { data: diseases } = useQuery<any[]>({
    queryKey: ["/api/diseases"],
  });

  const { data: medications } = useQuery<any[]>({
    queryKey: ["/api/medications"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: examination ? {
      petId: examination.petId.toString(),
      diseaseId: examination.diseaseId.toString(),
      examinationDate: new Date(examination.examinationDate).toISOString().split('T')[0],
      notes: examination.notes,
      medications: examination.medications?.length > 0 
        ? examination.medications.map((med: any) => ({
            medicationId: med.medicationId.toString(),
            quantity: med.quantity.toString(),
          }))
        : [{ medicationId: "", quantity: "" }],
    } : {
      medications: [{ medicationId: "", quantity: "" }],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // 日付をISO文字列形式に変換
      const formattedValues = {
        ...values,
        examinationDate: new Date(values.examinationDate).toISOString(),
      };

      const response = await fetch(examination 
        ? `/api/examinations/${examination.id}` 
        : "/api/examinations", {
        method: examination ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
      toast({
        title: "Success",
        description: "Examination has been saved.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="petId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ペット</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ペットを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pets?.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id.toString()}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diseaseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>病名</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="病名を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {diseases?.map((disease) => (
                    <SelectItem
                      key={disease.id}
                      value={disease.id.toString()}
                    >
                      {disease.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="examinationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>診察日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">投薬</h3>
          {form.watch("medications").map((_, index) => (
            <div key={index} className="flex gap-4">
              <FormField
                control={form.control}
                name={`medications.${index}.medicationId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="薬を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medications?.map((med) => (
                          <SelectItem
                            key={med.id}
                            value={med.id.toString()}
                          >
                            {med.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`medications.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="数量"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              form.setValue("medications", [
                ...form.watch("medications"),
                { medicationId: "", quantity: "" },
              ])
            }
          >
            薬を追加
          </Button>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "保存中..." : "診察情報を保存"}
        </Button>
      </form>
    </Form>
  );
}
