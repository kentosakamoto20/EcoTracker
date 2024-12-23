import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

interface Props {
  onFilterChange: (filters: Filters) => void;
}

interface Filters {
  petId?: string;
  diseaseId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function ExaminationFilter({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<Filters>({});

  const { data: pets } = useQuery<any[]>({
    queryKey: ["/api/pets"],
  });

  const { data: diseases } = useQuery<any[]>({
    queryKey: ["/api/diseases"],
  });

  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "all" ? undefined : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ペット</Label>
          <Select
            value={filters.petId}
            onValueChange={(value) => handleFilterChange("petId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {pets?.map((pet) => (
                <SelectItem key={pet.id} value={pet.id.toString()}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>病名</Label>
          <Select
            value={filters.diseaseId}
            onValueChange={(value) => handleFilterChange("diseaseId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {diseases?.map((disease) => (
                <SelectItem key={disease.id} value={disease.id.toString()}>
                  {disease.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>開始日</Label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>終了日</Label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
