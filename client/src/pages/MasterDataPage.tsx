import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MasterDataTable from "@/components/MasterDataTable";
import BackToMenuButton from "@/components/BackToMenuButton";

export default function MasterDataPage() {
  const masterDataTypes = [
    {
      type: "owners" as const,
      columns: [
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "address", label: "Address" },
      ],
    },
    {
      type: "pets" as const,
      columns: [
        { key: "name", label: "Name" },
        { key: "species", label: "Species" },
        { key: "breed", label: "Breed" },
        { key: "birthDate", label: "Birth Date" },
      ],
    },
    {
      type: "diseases" as const,
      columns: [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
      ],
    },
    {
      type: "medications" as const,
      columns: [
        { key: "name", label: "Name" },
        { key: "price", label: "Price" },
        { key: "unit", label: "Unit" },
        { key: "description", label: "Description" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <BackToMenuButton />
      <h1 className="text-3xl font-bold">マスタ管理</h1>

      <Tabs defaultValue="owners">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="owners">飼い主</TabsTrigger>
          <TabsTrigger value="pets">ペット</TabsTrigger>
          <TabsTrigger value="diseases">病名</TabsTrigger>
          <TabsTrigger value="medications">薬剤</TabsTrigger>
        </TabsList>

        {masterDataTypes.map(({ type, columns }) => (
          <TabsContent key={type} value={type}>
            <div className="bg-card rounded-lg border p-6">
              <MasterDataTable type={type} columns={columns} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
