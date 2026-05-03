"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldMessage,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { employeesApi } from "@/lib/api";
import type {
  Benefit,
  BenefitsType,
  BenefitsStatus,
  CreateBenefitData,
  UpdateBenefitData,
} from "@/lib/types";

const TYPE_OPTIONS: { value: BenefitsType; label: string }[] = [
  { value: "VALE_TRANSPORTE", label: "Vale Transporte" },
  { value: "VALE_REFEICAO", label: "Vale Refeição" },
  { value: "PLANO_SAUDE", label: "Plano de Saúde" },
  { value: "OUTROS", label: "Outros" },
];

const STATUS_OPTIONS: { value: BenefitsStatus; label: string }[] = [
  { value: "ATIVO", label: "Ativo" },
  { value: "INATIVO", label: "Inativo" },
];

const benefitSchema = z.object({
  FUNCIONARIO_ID: z.string().min(1, "Funcionário é obrigatório"),
  TIPO: z.enum(["VALE_TRANSPORTE", "VALE_REFEICAO", "PLANO_SAUDE", "OUTROS"], {
    required_error: "Tipo é obrigatório",
  }),
  VALOR: z.coerce
    .number({ required_error: "Valor é obrigatório" })
    .positive("Valor deve ser positivo"),
  DATA_INICIO: z.string().min(1, "Data de início é obrigatória"),
  DATA_FIM: z.string().optional(),
  DESCRICAO: z.string().max(255, "Máximo de 255 caracteres").optional(),
  OBSERVACAO: z.string().max(500, "Máximo de 500 caracteres").optional(),
  STATUS_BENEFICIO: z.enum(["ATIVO", "INATIVO"]).optional() as z.ZodOptional<
    z.ZodEnum<["ATIVO", "INATIVO"]>
  >,
});

type BenefitFormData = z.infer<typeof benefitSchema>;

interface BenefitFormProps {
  benefit?: Benefit;
  onSubmit: (data: CreateBenefitData | UpdateBenefitData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  role?: string;
  employeeId?: string;
}

export function BenefitForm({
  benefit,
  onSubmit,
  isSubmitting,
  onCancel,
  role,
  employeeId,
}: BenefitFormProps) {
  const isEmployee = role === "EMPLOYEE";

  const { data: employeeData } = useQuery({
    queryKey: ["employee"],
    queryFn: () => employeesApi.getAll(),
    enabled: !isEmployee,
  });

  const employees =
    employeeData?.data?.filter((e) => e.STATUS === "ATIVO") || [];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BenefitFormData>({
    resolver: zodResolver(benefitSchema),
    defaultValues: {
      FUNCIONARIO_ID:
        benefit?.FUNCIONARIO?.ID || (isEmployee ? (employeeId ?? "") : ""),
      TIPO: benefit?.TIPO,
      VALOR: benefit?.VALOR ?? undefined,
      DATA_INICIO: benefit?.DATA_INICIO?.split("T")[0] || "",
      DATA_FIM: benefit?.DATA_FIM?.split("T")[0] || "",
      DESCRICAO: benefit?.DESCRICAO ?? "",
      OBSERVACAO: benefit?.OBSERVACAO ?? "",
      STATUS_BENEFICIO: benefit?.STATUS_BENEFICIO,
    },
  });

  const employeeID = useWatch({ control, name: "FUNCIONARIO_ID" });
  const typeValue = useWatch({ control, name: "TIPO" });
  const statusValue = useWatch({ control, name: "STATUS_BENEFICIO" });

  const handleFormSubmit = async (benefitForm: BenefitFormData) => {
    const payload: CreateBenefitData | UpdateBenefitData = {
      FUNCIONARIO_ID: benefitForm.FUNCIONARIO_ID,
      TIPO: benefitForm.TIPO,
      VALOR: benefitForm.VALOR,
      DATA_INICIO: benefitForm.DATA_INICIO,
      DATA_FIM: benefitForm.DATA_FIM || undefined,
      DESCRICAO: benefitForm.DESCRICAO || undefined,
      OBSERVACAO: benefitForm.OBSERVACAO || undefined,
      ...(benefit && benefitForm.STATUS_BENEFICIO
        ? { STATUS_BENEFICIO: benefitForm.STATUS_BENEFICIO }
        : {}),
    };
    await onSubmit(payload);
  };

  if (isEmployee && !employeeID) {
    return (
      <p className="text-sm text-destructive py-4">
        Seu usuário não está vinculado a um funcionário. Contate o
        administrador.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup>
        {!isEmployee && (
          <Field>
            <FieldLabel>Funcionário *</FieldLabel>
            <Select
              value={employeeID}
              onValueChange={(value) => setValue("FUNCIONARIO_ID", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.ID} value={emp.ID}>
                    {emp.NOME} - {emp.MATRICULA}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.FUNCIONARIO_ID && (
              <FieldMessage variant="error">
                {errors.FUNCIONARIO_ID.message}
              </FieldMessage>
            )}
          </Field>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Tipo *</FieldLabel>
            <Select
              value={typeValue}
              onValueChange={(value) => setValue("TIPO", value as BenefitsType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo..." />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.TIPO && (
              <FieldMessage variant="error">{errors.TIPO.message}</FieldMessage>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="VALOR">Valor (R$)</FieldLabel>
            <Input
              id="VALOR"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              {...register("VALOR")}
            />
            {errors.VALOR && (
              <FieldMessage variant="error">
                {errors.VALOR.message}
              </FieldMessage>
            )}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="DATA_INICIO">Data de Início *</FieldLabel>
            <Input id="DATA_INICIO" type="date" {...register("DATA_INICIO")} />
            {errors.DATA_INICIO && (
              <FieldMessage variant="error">
                {errors.DATA_INICIO.message}
              </FieldMessage>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="DATA_FIM">Data de Fim</FieldLabel>
            <Input id="DATA_FIM" type="date" {...register("DATA_FIM")} />
            {errors.DATA_FIM && (
              <FieldMessage variant="error">
                {errors.DATA_FIM.message}
              </FieldMessage>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="DESCRICAO">Descrição</FieldLabel>
          <Textarea
            id="DESCRICAO"
            rows={2}
            maxLength={255}
            placeholder="Máximo de 255 caracteres"
            {...register("DESCRICAO")}
          />
          {errors.DESCRICAO && (
            <FieldMessage variant="error">
              {errors.DESCRICAO.message}
            </FieldMessage>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="OBSERVACAO">Observação</FieldLabel>
          <Textarea
            id="OBSERVACAO"
            rows={3}
            maxLength={500}
            placeholder="Máximo de 500 caracteres"
            {...register("OBSERVACAO")}
          />
          {errors.OBSERVACAO && (
            <FieldMessage variant="error">
              {errors.OBSERVACAO.message}
            </FieldMessage>
          )}
        </Field>

        {benefit && (
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("STATUS_BENEFICIO", value as BenefitsStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
            {benefit ? "Salvar" : "Criar"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
