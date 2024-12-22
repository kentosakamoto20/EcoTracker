import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  petId: z.string().min(1, "Please select a pet"),
  diseaseId: z.string().min(1, "Please select a disease"),
  examinationDate: z.string().min(1, "Please select a date"),
  notes: z.string().optional(),
  medications: z.array(z.object({
    medicationId: z.string().min(1, "Please select a medication"),
    quantity: z.string().min(1, "Please enter a quantity"),
  })),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExaminationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    defaultValues: {
      medications: [{ medicationId: "", quantity: "" }],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await fetch("/api/examinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
              <FormLabel>Pet</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet" />
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
              <FormLabel>Disease</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select disease" />
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
              <FormLabel>Examination Date</FormLabel>
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Medications</h3>
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
                          <SelectValue placeholder="Select medication" />
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
                        placeholder="Quantity"
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
            Add Medication
          </Button>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Examination"}
        </Button>
      </form>
    </Form>
  );
}
