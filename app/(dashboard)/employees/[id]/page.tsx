"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  employeesApi,
  vacationsApi,
  requestsApi,
  payrollApi,
  benefitsApi,
} from "@/lib/api";
import {
  Benefit,
  PlanoSaudeMetadata,
  ValeRefeicaoMetadata,
  ValeTransporteMetadata,
} from "@/lib/types";

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const BENEFIT_TYPE_LABELS: Record<string, string> = {
  VALE_TRANSPORTE: "Vale Transporte",
  VALE_REFEICAO: "Vale Refeição",
  PLANO_SAUDE: "Plano de Saúde",
  OUTROS: "Outros",
};

function renderBenefitDetails(benefit: Benefit): string {
  if (benefit.TIPO === "OUTROS") {
    return benefit.DESCRICAO || "—";
  }
  if (!benefit.METADADOS) return "—";
  if (benefit.TIPO === "VALE_TRANSPORTE") {
    const m = benefit.METADADOS as ValeTransporteMetadata;
    return `${formatCurrency(m.VALOR_PASSAGEM)}/passagem × ${m.QUANTIDADE_DIARIA}/dia × ${m.DIAS_UTEIS} dias`;
  }
  if (benefit.TIPO === "VALE_REFEICAO") {
    const m = benefit.METADADOS as ValeRefeicaoMetadata;
    return `${formatCurrency(m.VALOR_DIARIO)}/dia × ${m.DIAS_UTEIS} dias`;
  }
  if (benefit.TIPO === "PLANO_SAUDE") {
    const m = benefit.METADADOS as PlanoSaudeMetadata;
    const planLabel = {
      INDIVIDUAL: "Individual",
      FAMILIAR: "Familiar",
      EMPRESARIAL: "Empresarial",
    }[m.TIPO_PLANO];
    const coverageLabel = {
      BASICO: "Básico",
      INTERMEDIARIO: "Intermediário",
      PREMIUM: "Premium",
    }[m.COBERTURA];
    return `${m.OPERADORA} · ${planLabel} · ${coverageLabel} · ${m.PERCENTUAL_FUNCIONARIO}% funcionário`;
  }
  return "—";
}

const formatCurrency = (value: string | number) =>
  Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (date: string) =>
  new Date(date.split("T")[0] + "T00:00:00").toLocaleDateString("pt-BR");

function calcVacationBalance(dataAdmissao: string, daysTaken: number) {
  const admissionDate = new Date(dataAdmissao);
  const today = new Date();
  const totalMonths =
    (today.getFullYear() - admissionDate.getFullYear()) * 12 +
    (today.getMonth() - admissionDate.getMonth());
  const completePeriods = Math.floor(totalMonths / 12);
  const monthsInCurrentPeriod = totalMonths % 12;
  return {
    totalAccrued: completePeriods * 30,
    proportionalDays: Math.floor((monthsInCurrentPeriod / 12) * 30),
    balance: completePeriods * 30 - daysTaken,
    monthsInCurrentPeriod,
  };
}

export default function EmployeeProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: benefitsData } = useQuery({
    queryKey: ["benefits", id],
    queryFn: () => benefitsApi.getEmployee(id),
    staleTime: 0,
  });

  const { data: employeeData, isLoading: loadingEmployee } = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.getById(id),
    staleTime: 0,
  });

  const { data: payrollData } = useQuery({
    queryKey: ["payroll"],
    queryFn: () => payrollApi.getAll(),
    staleTime: 0,
  });

  const { data: vacationsData } = useQuery({
    queryKey: ["vacations"],
    queryFn: () => vacationsApi.getAll(),
    staleTime: 0,
  });

  const { data: requestsData } = useQuery({
    queryKey: ["requests"],
    queryFn: () => requestsApi.getAll(),
    staleTime: 0,
  });

  const employee = employeeData?.data;
  const benefits = benefitsData?.data ?? [];

  const payrolls = (payrollData?.data || [])
    .filter((p) => (p.FUNCIONARIO?.ID ?? p.FUNCIONARIO_ID) === id)
    .sort((a, b) => {
      if (b.ANO_REFERENCIA !== a.ANO_REFERENCIA)
        return b.ANO_REFERENCIA - a.ANO_REFERENCIA;
      return b.MES_REFERENCIA - a.MES_REFERENCIA;
    });

  const vacations = (vacationsData?.data || []).filter(
    (v) => (v.FUNCIONARIO?.ID ?? v.FUNCIONARIO_ID) === id,
  );

  const requests = (requestsData?.data || []).filter(
    (r) => (r.FUNCIONARIO?.ID ?? r.FUNCIONARIO_ID) === id,
  );

  const daysTaken = vacations
    .filter((v) => v.STATUS_FERIAS === "APROVADO")
    .reduce((sum, v) => sum + v.DIAS_SOLICITADOS, 0);

  const vacationBalance = employee
    ? calcVacationBalance(employee.DATA_ADMISSAO, daysTaken)
    : null;

  const handleSlip = async (payrollId: string) => {
    try {
      await payrollApi.slip(payrollId);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message ?? "Erro ao gerar holerite");
    }
  };

  if (loadingEmployee) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Funcionário não encontrado.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{employee.NOME}</h1>
            <StatusBadge status={employee.STATUS} />
          </div>
          <p className="text-sm text-muted-foreground">
            Matrícula: {employee.MATRICULA}
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-base">Informações Pessoais</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">CPF</p>
            <p className="font-medium">{employee.CPF}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">RG</p>
            <p className="font-medium">{employee.RG || "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <p className="font-medium">{employee.EMAIL}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-medium">{employee.TELEFONE || "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
            <p className="font-medium">
              {formatDate(employee.DATA_NASCIMENTO)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data de Admissão</p>
            <p className="font-medium">{formatDate(employee.DATA_ADMISSAO)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Departamento</p>
            <p className="font-medium">{employee.DEPARTAMENTO?.NOME || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cargo</p>
            <p className="font-medium">{employee.CARGO?.NOME || "-"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gestor</p>
          <p className="font-medium">{employee.GESTOR?.NOME || "-"}</p>
        </div>
      </div>

      {vacationBalance && (
        <div className="rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-base">Saldo de Férias (CLT)</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-md bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">
                {vacationBalance.totalAccrued}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Dias acumulados
              </p>
            </div>
            <div className="rounded-md bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">{daysTaken}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Dias Utilizados
              </p>
            </div>
            <div
              className={`rounded-md p-4 text-center ${
                vacationBalance.balance < 0
                  ? "bg-destructive/10"
                  : "bg-green-500/10"
              }`}
            >
              <p
                className={`text-2xl font-bold ${
                  vacationBalance.balance < 0
                    ? "text-destructive"
                    : "text-green-600"
                }`}
              >
                {vacationBalance.balance}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Saldo Disponível
              </p>
            </div>
            <div className="rounded-md bg-muted/40 p-4 text-center">
              <p className="text-2xl font-bold">
                {vacationBalance.proportionalDays}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Acumulado ({vacationBalance.monthsInCurrentPeriod} meses)
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-base">
          Folhas de Pagamento ({payrolls.length})
        </h2>
        {payrolls.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma folha encontrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Período
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Salário Base
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Salário Líquido
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr key={p.ID} className="border-b last:border-0">
                    <td className="py-2">
                      {MESES[p.MES_REFERENCIA - 1]}/{p.ANO_REFERENCIA}
                    </td>
                    <td className="py-2">{formatCurrency(p.SALARIO_BASE)}</td>
                    <td className="py-2">
                      {formatCurrency(p.SALARIO_LIQUIDO)}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={p.STATUS_FOLHA} />
                    </td>
                    <td className="py-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSlip(p.ID)}
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Holerite
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-base">Férias ({vacations.length})</h2>
        {vacations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma férias encontrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Início
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Fim
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Dias
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Aprovado por
                  </th>
                </tr>
              </thead>
              <tbody>
                {vacations.map((v) => (
                  <tr key={v.ID} className="border-b last:border-0">
                    <td className="py-2">{formatDate(v.DATA_INICIO)}</td>
                    <td className="py-2">{formatDate(v.DATA_FIM)}</td>
                    <td className="py-2">{v.DIAS_SOLICITADOS}</td>
                    <td className="py-2">
                      <StatusBadge status={v.STATUS_FERIAS} />
                    </td>
                    <td className="py-2">
                      {v.APROVADO_POR?.NOME_USUARIO || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-base">
          Solicitações ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitação encontrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Descrição
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Data
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.ID} className="border-b last:border-0">
                    <td className="py-2">{r.TIPO}</td>
                    <td className="py-2 max-w-xs truncate">{r.DESCRICAO}</td>
                    <td className="py-2">{formatDate(r.DATA_SOLICITACAO)}</td>
                    <td className="py-2">
                      <StatusBadge status={r.STATUS} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-base">
          Benefícios ({benefits.length})
        </h2>
        {benefits.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum benefício encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Valor Mensal
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Detalhes
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Início
                  </th>
                  <th className="text-left py-2 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {benefits.map((b) => (
                  <tr key={b.ID} className="border-b last:border-0">
                    <td className="py-2">
                      {BENEFIT_TYPE_LABELS[b.TIPO] ?? b.TIPO}
                    </td>
                    <td className="py-2">{formatCurrency(b.VALOR)}</td>
                    <td className="py-2 text-xs text-muted-foreground max-w-xs">
                      {renderBenefitDetails(b)}
                    </td>
                    <td className="py-2">{formatDate(b.DATA_INICIO)}</td>
                    <td className="py-2">
                      <StatusBadge status={b.STATUS_BENEFICIO} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
