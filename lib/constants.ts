import type { RequestType } from "./types";

type RequestTypeOption = { value: RequestType; label: string };

export const REQUEST_TYPES: RequestTypeOption[] = [
  { value: "DOCUMENTO", label: "Documento" },
  { value: "EQUIPAMENTO", label: "Equipamento" },
  { value: "BENEFICIO", label: "Benefício" },
  { value: "TREINAMENTO", label: "Treinamento" },
  { value: "OUTROS", label: "Outros" },
];
