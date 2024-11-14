import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema using Zod
const formSchema = z.object({
  DailyOreInput: z.number().min(0),
  Stock2Status: z.string(),
  CrushedOreSST: z.number().min(0),
  Class15: z.number().min(0),
  Class12: z.number().min(0),
  TransportedOre: z.number().min(0),
  IntermediateBunkerStatus: z.string(),
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
  TechExtraction: z.string(),
  LoadExtraction: z.string(),
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

const FormComponent: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      DailyOreInput: undefined,
      Stock2Status: "",
      CrushedOreSST: undefined,
      Class15: undefined,
      Class12: undefined,
      TransportedOre: undefined,
      IntermediateBunkerStatus: "",
      ProcessedOreMFC: undefined,
      OreMoisture: undefined,
      DryProcessedOre: undefined,
      Granite: undefined,
      Dikes: undefined,
      Shale: undefined,
      GrindingClassPlus0_20mm: undefined,
      GrindingClassMinus0_08mm: undefined,
      PulpDensity: undefined,
      CopperContentOre: undefined,
      CopperContentWaste: undefined,
      CopperContentConcentrate: undefined,
      TechExtraction: "",
      LoadExtraction: "",
      CopperConcentrate: undefined,
      ConcentrateMoisture: undefined,
      CopperContent: undefined,
      MetalCopper: undefined,
      ThickenerWeight: undefined,
    },
  });

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
              {field.en}
            </label>
            <input
              id={field.en}
              type="number"
              step="0.1"
              {...form.register(field.en as keyof FormValues, {
                valueAsNumber: true,
              })}
              placeholder={`${field.bg} (${field.unit})`}
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
        type="submit"
        className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
