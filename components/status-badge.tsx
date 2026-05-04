import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "success" | "warning" | "error" | "default" | "info";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const statusVariantMap: Record<string, StatusVariant> = {
  ATIVO: "success",
  INATIVO: "default",

  PENDENTE: "warning",
  APROVADO: "success",
  REJEITADO: "error",
  CANCELADO: "default",

  DOCUMENTO: "info",
  EQUIPAMENTO: "info",
  BENEFICIO: "info",
  TREINAMENTO: "info",
  OUTROS: "default",

  VALE_TRANSPORTE: "info",
  VALE_REFEICAO: "info",
  PLANO_SAUDE: "info",
};

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels: Record<string, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  PENDENTE: "Pendente",
  APROVADO: "Aprovado",
  REJEITADO: "Rejeitado",
  CANCELADO: "Cancelado",
  DOCUMENTO: "Documento",
  EQUIPAMENTO: "Equipamento",
  BENEFICIO: "Benefício",
  TREINAMENTO: "Treinamento",
  OUTROS: "Outros",
  VALE_TRANSPORTE: "Vale Transporte",
  VALE_REFEICAO: "Vale Refeição",
  PLANO_SAUDE: "Plano de Saúde",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariantMap[status] || "default";
  const label = statusLabels[status] || status;

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", variantStyles[resolvedVariant], className)}
    >
      {label}
    </Badge>
  );
}
