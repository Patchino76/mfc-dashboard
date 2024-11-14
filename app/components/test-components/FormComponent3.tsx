import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema using Zod
const formSchema = z.object({
  DailyOreInput: z.number().min(0),
  Stock2Status: z.number().min(0),
  CrushedOreSST: z.number().min(0),
  Class15: z.number().min(0),
  Class12: z.number().min(0),
  TransportedOre: z.number().min(0),
  IntermediateBunkerStatus: z.number().min(0),
  ProcessedOreMFC: z.number().min(0),
  OreMoisture: z.number().min(0).max(100),
  DryProcessedOre: z.number().min(0),
  Granite: z.number().min(0),
  Dikes: z.number().min(0),
  Shale: z.number().min(0),
  GrindingClassPlus0_20mm: z.number().min(0),
  GrindingClassMinus0_08mm: z.number().min(0),
  PulpDensity: z.number().min(0).max(100),
  CopperContentOre: z.number().min(0).max(100),
  CopperContentWaste: z.number().min(0).max(100),
  CopperContentConcentrate: z.number().min(0).max(100),
  TechExtraction: z.number().min(0).max(100),
  LoadExtraction: z.number().min(0).max(100),
  CopperConcentrate: z.number().min(0),
  ConcentrateMoisture: z.number().min(0).max(100),
  CopperContent: z.number().min(0).max(100),
  MetalCopper: z.number().min(0),
  ThickenerWeight: z.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

const columnNames = [
  {
    en: "DailyOreInput",
    bg: "Подадена руда от МГТЛ за денонощието",
    unit: "тона",
  },
  { en: "Stock2Status", bg: "Състояние на склад №2", unit: "метра" },
  { en: "CrushedOreSST", bg: "Натрошена руда от Цех ССТ", unit: "тона" },
  { en: "Class15", bg: "Класа_15", unit: "%" },
  { en: "Class12", bg: "Класа_12", unit: "%" },
  {
    en: "TransportedOre",
    bg: "Превозена руда до междинни бункери",
    unit: "тона",
  },
  {
    en: "IntermediateBunkerStatus",
    bg: "Състояние на междинни бункери",
    unit: "",
  },
  { en: "ProcessedOreMFC", bg: "Преработена руда в цех МФЦ", unit: "тона" },
  { en: "OreMoisture", bg: "Влага на преработената руда", unit: "%" },
  { en: "DryProcessedOre", bg: "Суха преработена руда", unit: "тона" },
  { en: "Granite", bg: "Грано", unit: "%" },
  { en: "Dikes", bg: "Дайки", unit: "%" },
  { en: "Shale", bg: "Шисти", unit: "%" },
  { en: "GrindingClassPlus0_20mm", bg: "Смилане класа + 0,20мм", unit: "%" },
  { en: "GrindingClassMinus0_08mm", bg: "Смилане класа -0,08мм", unit: "%" },
  { en: "PulpDensity", bg: "Плътност на пулпа", unit: "%" },
  {
    en: "CopperContentOre",
    bg: "Съдържание на мед в рудите по Куриер",
    unit: "%",
  },
  {
    en: "CopperContentWaste",
    bg: "Съдържание на мед в отпадъка по Куриер",
    unit: "%",
  },
  {
    en: "CopperContentConcentrate",
    bg: "Съдържание на мед в медния к-т Куриер",
    unit: "%",
  },
  { en: "TechExtraction", bg: "Технологично извличане по Куриер", unit: "%" },
  { en: "LoadExtraction", bg: "Товарно извличане", unit: "%" },
  { en: "CopperConcentrate", bg: "Добит меден концентрат", unit: "тона" },
  { en: "ConcentrateMoisture", bg: "Влага на медния концентрат", unit: "%" },
  { en: "CopperContent", bg: "Съдържание на мед в медния к-т", unit: "%" },
  { en: "MetalCopper", bg: "Метал мед в медния концентрат", unit: "тона" },
  { en: "ThickenerWeight", bg: "Литрово тегло в сгъстителя", unit: "кг/литър" },
];

const FormComponent3: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  //   const handlePaste = () => {
  //     navigator.clipboard.readText().then((clipboardData) => {
  //       const rows = clipboardData.split("\n");

  //       const newFormData: Partial<FormValues> = {};
  //       rows.forEach((row) => {
  //         const cells = row.split("\t");
  //         cells.forEach((cell, index) => {
  //           if (index < columnNames.length) {
  //             const fieldName = columnNames[index].en as keyof FormValues;
  //             newFormData[fieldName] = !isNaN(parseFloat(cell))
  //               ? parseFloat(cell)
  //               : 0;
  //           }
  //         });
  //       });

  //       form.reset(newFormData);
  //     });
  //   };
  const handlePaste = () => {
    navigator.clipboard.readText().then((clipboardData) => {
      console.log("Clipboard Data:", clipboardData);
      const rows = clipboardData.split("\n");

      const newFormData: Partial<FormValues> = {};
      rows.forEach((row) => {
        const cells = row.split("\t");
        console.log("Cells:", cells);
        console.log("First Cell Value:", cells[0]); // Log first cell specifically

        cells.forEach((cell, index) => {
          if (index < columnNames.length) {
            const fieldName = columnNames[index].en as keyof FormValues;
            const parsedValue = parseFloat(cell.trim()); // Trim whitespace

            console.log(`Field: ${fieldName}, Parsed Value: ${parsedValue}`);

            // Check if parsed value is valid
            if (!isNaN(parsedValue)) {
              newFormData[fieldName] = parsedValue;
            } else {
              console.warn(`Invalid value for ${fieldName}: ${cell}`); // Log invalid values
              newFormData[fieldName] = 0; // Handle as needed
            }
          }
        });
      });

      console.log("New Form Data:", newFormData); // Log final new form data

      // Check specifically for DailyOreInput
      console.log(`DailyOreInput Value: ${newFormData.DailyOreInput}`);

      form.reset(newFormData);
    });
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-3 gap-4">
        {columnNames.map((field, index) => (
          <div key={index} className="flex flex-col space-y-1.5">
            <label
              htmlFor={field.en}
              className="text-sm font-medium leading-6 text-gray-900"
            >
              {field.bg}
            </label>
            <input
              id={field.en}
              type="number"
              step="0.001"
              {...form.register(field.en as keyof FormValues, {
                valueAsNumber: true,
              })}
              placeholder={`0 (${field.unit})`}
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {form.formState.errors[field.en as keyof FormValues] && (
              <p className="text-red-500 text-xs">
                {form.formState.errors[field.en as keyof FormValues]?.message}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePaste}
        className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Пастирай
      </button>
      <button
        type="submit"
        className="mt-4 ml-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Запази
      </button>
    </form>
  );
};

export default FormComponent3;
