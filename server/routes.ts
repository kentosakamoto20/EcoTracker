import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { db } from "@db";
import { 
  owners, pets, diseases, medications, examinations, 
  examinationMedications, invoices 
} from "@db/schema";
import { eq } from "drizzle-orm";
import ExcelJS from "exceljs";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Master data routes
  app.get("/api/owners", async (req, res) => {
    const allOwners = await db.select().from(owners);
    res.json(allOwners);
  });

  app.post("/api/owners", async (req, res) => {
    const [newOwner] = await db.insert(owners).values(req.body).returning();
    res.json(newOwner);
  });

  app.get("/api/pets", async (req, res) => {
    const allPets = await db.select().from(pets);
    res.json(allPets);
  });

  app.post("/api/pets", async (req, res) => {
    const [newPet] = await db.insert(pets).values(req.body).returning();
    res.json(newPet);
  });

  app.get("/api/diseases", async (req, res) => {
    const allDiseases = await db.select().from(diseases);
    res.json(allDiseases);
  });

  app.post("/api/diseases", async (req, res) => {
    const [newDisease] = await db.insert(diseases).values(req.body).returning();
    res.json(newDisease);
  });

  app.get("/api/medications", async (req, res) => {
    const allMedications = await db.select().from(medications);
    res.json(allMedications);
  });

  app.post("/api/medications", async (req, res) => {
    const [newMedication] = await db.insert(medications).values(req.body).returning();
    res.json(newMedication);
  });

  // Examination routes
  app.get("/api/examinations", async (req, res) => {
    const allExaminations = await db.select().from(examinations);
    res.json(allExaminations);
  });

  app.post("/api/examinations", async (req, res) => {
    try {
      const examinationData = {
        ...req.body,
        petId: parseInt(req.body.petId),
        diseaseId: parseInt(req.body.diseaseId),
        examinationDate: new Date(req.body.examinationDate),
      };

      const [newExamination] = await db
        .insert(examinations)
        .values(examinationData)
        .returning();

      // 投薬情報の登録
      if (req.body.medications && req.body.medications.length > 0) {
        for (const med of req.body.medications) {
          await db.insert(examinationMedications).values({
            examinationId: newExamination.id,
            medicationId: parseInt(med.medicationId),
            quantity: parseFloat(med.quantity),
            price: 0, // 薬価はマスタから取得して設定する必要があります
          });
        }
      }

      res.json(newExamination);
    } catch (error: any) {
      console.error('Error creating examination:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Invoice routes
  app.get("/api/invoices", async (req, res) => {
    const allInvoices = await db.select().from(invoices);
    res.json(allInvoices);
  });

  app.post("/api/invoices", async (req, res) => {
    const [newInvoice] = await db.insert(invoices).values(req.body).returning();
    res.json(newInvoice);
  });

  app.get("/api/invoices/:id/download", async (req, res) => {
    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, parseInt(req.params.id)),
      with: {
        owner: true,
        examinations: {
          with: {
            pet: true,
            disease: true,
            medications: {
              with: {
                medication: true
              }
            }
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    // Add invoice details
    worksheet.mergeCells("A1:D1");
    worksheet.getCell("A1").value = "VETERINARY CLINIC INVOICE";
    worksheet.getCell("A1").alignment = { horizontal: "center" };

    worksheet.getCell("A3").value = "Invoice #:";
    worksheet.getCell("B3").value = invoice.id;
    worksheet.getCell("A4").value = "Date:";
    worksheet.getCell("B4").value = invoice.createdAt;

    // Add owner details
    worksheet.getCell("A6").value = "Owner Name:";
    worksheet.getCell("B6").value = invoice.owner.name;
    worksheet.getCell("A7").value = "Phone:";
    worksheet.getCell("B7").value = invoice.owner.phone;

    // Add examination details
    let row = 9;
    worksheet.getCell(`A${row}`).value = "Description";
    worksheet.getCell(`B${row}`).value = "Quantity";
    worksheet.getCell(`C${row}`).value = "Price";
    worksheet.getCell(`D${row}`).value = "Total";

    row++;
    let total = 0;

    invoice.examinations.forEach(exam => {
      exam.medications.forEach(med => {
        worksheet.getCell(`A${row}`).value = med.name;
        worksheet.getCell(`B${row}`).value = med.quantity;
        worksheet.getCell(`C${row}`).value = med.price;
        worksheet.getCell(`D${row}`).value = med.quantity * med.price;
        total += med.quantity * med.price;
        row++;
      });
    });

    worksheet.getCell(`C${row + 1}`).value = "Total:";
    worksheet.getCell(`D${row + 1}`).value = total;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.id}.xlsx`
    );

    await workbook.xlsx.write(res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
