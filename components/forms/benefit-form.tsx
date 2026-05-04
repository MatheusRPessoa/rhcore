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
  ValeTransporteMetadata,
  ValeRefeicaoMetadata,
  PlanoSaudeMetadata,
} from "@/lib/types";
import { useEffect, useRef } from "react";

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

const TIPO_PLANO_OPTIONS = [
  { value: "INDIVIDUAL", label: "Básico" },
  { value: "FAMILIAR", label: "Familiar" },
  { value: "EMPRESARIAL", label: "Empresarial" },
];

const COBERTURA_OPTIONS = [
  { value: "BASICO", label: "Básico" },
  { value: "INTERMEDIARIO", label: "Intermediário" },
  { value: "PREMIUM", label: "Premium" },
];

const benefitSchema = z
  .object({
    FUNCIONARIO_ID: z.string().min(1, "Funcionário é obrigatório"),
    TIPO: z.enum(
      ["VALE_TRANSPORTE", "VALE_REFEICAO", "PLANO_SAUDE", "OUTROS"],
      {
        required_error: "Tipo é obrigatório",
      },
    ),
    DATA_INICIO: z.string().min(1, "Data de início é obrigatória"),
    DATA_FIM: z.string().optional(),
    DESCRICAO: z.string().max(255, "Máximo de 255 caracteres").optional(),
    OBSERVACAO: z.string().max(500, "Máximo de 500 caracteres").optional(),
    STATUS_BENEFICIO: z.enum(["ATIVO", "INATIVO"]).optional() as z.ZodOptional<
      z.ZodEnum<["ATIVO", "INATIVO"]>
    >,
    VALOR_PASSAGEM: z.coerce
      .number()
      .positive("Valor da passagem deve ser positivo")
      .optional(),
    QUANTIDADE_DIARIA: z.coerce
      .number()
      .int()
      .positive("Quantidade diária deve ser positiva")
      .optional(),
    VALOR_DIARIO: z.coerce
      .number()
      .positive("Valor diário deve ser positivo")
      .optional(),
    DIAS_UTEIS: z.coerce
      .number()
      .int()
      .min(1, "Mínimo 1 dia")
      .max(31, "Máximo de 31 dias")
      .optional(),
    VALOR: z.coerce.number().positive("Valor deve ser positivo").optional(),
    OPERADORA: z.string().max(100, "Máximo de 100 caracteres").optional(),
    TIPO_PLANO: z.enum(["INDIVIDUAL", "FAMILIAR", "EMPRESARIAL"]).optional(),
    COBERTURA: z.enum(["BASICO", "INTERMEDIARIO", "PREMIUM"]).optional(),
    PERCENTUAL_FUNCIONARIO: z.coerce
      .number()
      .min(0, "Mínimo 0%")
      .max(100, "Máximo 100%")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.TIPO === "VALE_TRANSPORTE") {
      if (!data.VALOR_PASSAGEM)
        ctx.addIssue({
          code: "custom",
          path: ["VALOR_PASSAGEM"],
          message: "Valor da passagem é obrigatório",
        });
      if (!data.QUANTIDADE_DIARIA)
        ctx.addIssue({
          code: "custom",
          path: ["QUANTIDADE_DIARIA"],
          message: "Quantidade diária é obrigatória",
        });
      if (!data.DIAS_UTEIS)
        ctx.addIssue({
          code: "custom",
          path: ["DIAS_UTEIS"],
          message: "Dias úteis é obrigatório",
        });
    }
    if (data.TIPO === "VALE_REFEICAO") {
      if (!data.VALOR_DIARIO)
        ctx.addIssue({
          code: "custom",
          path: ["VALOR_DIARIO"],
          message: "Valor diário é obrigatório",
        });
      if (!data.DIAS_UTEIS)
        ctx.addIssue({
          code: "custom",
          path: ["DIAS_UTEIS"],
          message: "Dias úteis é obrigatório",
        });
    }
    if (data.TIPO === "PLANO_SAUDE") {
      if (!data.VALOR)
        ctx.addIssue({
          code: "custom",
          path: ["VALOR"],
          message: "Valor total do plano é obrigatório",
        });
      if (!data.OPERADORA)
        ctx.addIssue({
          code: "custom",
          path: ["OPERADORA"],
          message: "Operadora é obrigatória",
        });
      if (!data.TIPO_PLANO)
        ctx.addIssue({
          code: "custom",
          path: ["TIPO_PLANO"],
          message: "Tipo de plano é obrigatório",
        });
      if (!data.COBERTURA)
        ctx.addIssue({
          code: "custom",
          path: ["COBERTURA"],
          message: "Cobertura é obrigatória",
        });
      if (
        data.PERCENTUAL_FUNCIONARIO === undefined ||
        data.PERCENTUAL_FUNCIONARIO === null
      )
        ctx.addIssue({
          code: "custom",
          path: ["PERCENTUAL_FUNCIONARIO"],
          message: "Percentual do funcionário é obrigatório",
        });
    }
    if (data.TIPO === "OUTROS") {
      if (!data.VALOR)
        ctx.addIssue({
          code: "custom",
          path: ["VALOR"],
          message: "Valor é obrigatório",
        });
    }
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

function getDefaultValues(
  benefit?: Benefit,
  isEmployee?: boolean,
  employeeId?: string,
): Partial<BenefitFormData> {
  const base: Partial<BenefitFormData> = {
    FUNCIONARIO_ID:
      benefit?.FUNCIONARIO?.ID || (isEmployee ? (employeeId ?? "") : ""),
    TIPO: benefit?.TIPO,
    DATA_INICIO: benefit?.DATA_INICIO?.split("T")[0] || "",
    DATA_FIM: benefit?.DATA_FIM?.split("T")[0] || "",
    DESCRICAO: benefit?.DESCRICAO ?? "",
    OBSERVACAO: benefit?.OBSERVACAO ?? "",
    STATUS_BENEFICIO: benefit?.STATUS_BENEFICIO,
  };

  if (!benefit?.METADADOS) {
    if (benefit?.TIPO === "PLANO_SAUDE" || benefit?.TIPO === "OUTROS") {
      return { ...base, VALOR: benefit.VALOR };
    }
    return base;
  }

  if (benefit.TIPO === "VALE_TRANSPORTE") {
    const m = benefit.METADADOS as ValeTransporteMetadata;
    return {
      ...base,
      VALOR_PASSAGEM: m.VALOR_PASSAGEM,
      QUANTIDADE_DIARIA: m.QUANTIDADE_DIARIA,
      DIAS_UTEIS: m.DIAS_UTEIS,
    };
  }
  if (benefit.TIPO === "VALE_REFEICAO") {
    const m = benefit.METADADOS as ValeRefeicaoMetadata;
    return { ...base, VALOR_DIARIO: m.VALOR_DIARIO, DIAS_UTEIS: m.DIAS_UTEIS };
  }
  if (benefit.TIPO === "PLANO_SAUDE") {
    const m = benefit.METADADOS as PlanoSaudeMetadata;
    return {
      ...base,
      VALOR: benefit.VALOR,
      OPERADORA: m.OPERADORA,
      TIPO_PLANO: m.TIPO_PLANO,
      COBERTURA: m.COBERTURA,
      PERCENTUAL_FUNCIONARIO: m.PERCENTUAL_FUNCIONARIO,
    };
  }
  return { ...base, VALOR: benefit.VALOR };
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
  const typeChangedRef = useRef(false);

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
    resetField,
    control,
    formState: { errors },
  } = useForm<BenefitFormData>({
    resolver: zodResolver(benefitSchema),
    defaultValues: getDefaultValues(benefit, isEmployee, employeeId),
  });

  const employeeID = useWatch({ control, name: "FUNCIONARIO_ID" });
  const typeValue = useWatch({ control, name: "TIPO" });
  const statusValue = useWatch({ control, name: "STATUS_BENEFICIO" });
  const tipoPlanoValue = useWatch({ control, name: "TIPO_PLANO" });
  const coberturaValue = useWatch({ control, name: "COBERTURA" });

  useEffect(() => {
    if (!typeChangedRef.current) {
      typeChangedRef.current = true;
      return;
    }
    resetField("VALOR_PASSAGEM");
    resetField("QUANTIDADE_DIARIA");
    resetField("DIAS_UTEIS");
    resetField("VALOR_DIARIO");
    resetField("VALOR");
    resetField("OPERADORA");
    resetField("TIPO_PLANO");
    resetField("COBERTURA");
    resetField("PERCENTUAL_FUNCIONARIO");
  }, [typeValue, resetField]);

  const handleFormSubmit = async (formData: BenefitFormData) => {
    const base = {
      FUNCIONARIO_ID: formData.FUNCIONARIO_ID,
      DATA_INICIO: formData.DATA_INICIO,
      DATA_FIM: formData.DATA_FIM || undefined,
      DESCRICAO: formData.DESCRICAO || undefined,
      OBSERVACAO: formData.OBSERVACAO || undefined,
      ...(benefit && formData.STATUS_BENEFICIO
        ? { STATUS_BENEFICIO: formData.STATUS_BENEFICIO }
        : {}),
    };

    let payload: CreateBenefitData | UpdateBenefitData;

    if (formData.TIPO === "VALE_TRANSPORTE") {
      payload = {
        ...base,
        TIPO: "VALE_TRANSPORTE",
        METADADOS: {
          VALOR_PASSAGEM: formData.VALOR_PASSAGEM!,
          QUANTIDADE_DIARIA: formData.QUANTIDADE_DIARIA!,
          DIAS_UTEIS: formData.DIAS_UTEIS!,
        },
      };
    } else if (formData.TIPO === "VALE_REFEICAO") {
      payload = {
        ...base,
        TIPO: "VALE_REFEICAO",
        METADADOS: {
          VALOR_DIARIO: formData.VALOR_DIARIO!,
          DIAS_UTEIS: formData.DIAS_UTEIS!,
        },
      };
    } else if (formData.TIPO === "PLANO_SAUDE") {
      payload = {
        ...base,
        TIPO: "PLANO_SAUDE",
        VALOR: formData.VALOR!,
        METADADOS: {
          OPERADORA: formData.OPERADORA!,
          TIPO_PLANO: formData.TIPO_PLANO!,
          COBERTURA: formData.COBERTURA!,
          PERCENTUAL_FUNCIONARIO: formData.PERCENTUAL_FUNCIONARIO!,
        },
      };
    } else {
      payload = {
        ...base,
        TIPO: "OUTROS",
        VALOR: formData.VALOR!,
      };
    }

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
              value={employeeID ?? ""}
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

        <Field>
          <FieldLabel>Tipo *</FieldLabel>
          <Select
            value={typeValue ?? ""}
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

        {typeValue === "VALE_TRANSPORTE" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="VALOR_PASSAGEM">
                  Valor da passagem (R$) *
                </FieldLabel>
                <Input
                  id="VALOR_PASSAGEM"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  {...register("VALOR_PASSAGEM")}
                />
                {errors.VALOR_PASSAGEM && (
                  <FieldMessage variant="error">
                    {errors.VALOR_PASSAGEM.message}
                  </FieldMessage>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="QUANTIDADE_DIARIA">
                  Passagens por dia *
                </FieldLabel>
                <Input
                  id="QUANTIDADE_DIARIA"
                  type="number"
                  min="1"
                  placeholder="2"
                  {...register("QUANTIDADE_DIARIA")}
                />
                {errors.QUANTIDADE_DIARIA && (
                  <FieldMessage variant="error">
                    {errors.QUANTIDADE_DIARIA.message}
                  </FieldMessage>
                )}
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="DIAS_UTEIS">Dias úteis/mês *</FieldLabel>
                <Input
                  id="DIAS_UTEIS"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="22"
                  {...register("DIAS_UTEIS")}
                />
                {errors.DIAS_UTEIS && (
                  <FieldMessage variant="error">
                    {errors.DIAS_UTEIS.message}
                  </FieldMessage>
                )}
              </Field>
            </div>
          </>
        )}

        {typeValue === "VALE_REFEICAO" && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="VALOR_DIARIO">
                Valor diário (R$) *
              </FieldLabel>
              <Input
                id="VALOR_DIARIO"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                {...register("VALOR_DIARIO")}
              />
              {errors.VALOR_DIARIO && (
                <FieldMessage variant="error">
                  {errors.VALOR_DIARIO.message}
                </FieldMessage>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="DIAS_UTEIS">Dias úteis/mês *</FieldLabel>
              <Input
                id="DIAS_UTEIS"
                type="number"
                min="1"
                max="31"
                placeholder="22"
                {...register("DIAS_UTEIS")}
              />
              {errors.DIAS_UTEIS && (
                <FieldMessage variant="error">
                  {errors.DIAS_UTEIS.message}
                </FieldMessage>
              )}
            </Field>
          </div>
        )}

        {typeValue === "PLANO_SAUDE" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="VALOR">
                  Valor total do plano (R$) *
                </FieldLabel>
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
              <Field>
                <FieldLabel htmlFor="OPERADORA">Operadora *</FieldLabel>
                <Input
                  id="OPERADORA"
                  placeholder="Ex: Unimed, Amil..."
                  {...register("OPERADORA")}
                />
                {errors.OPERADORA && (
                  <FieldMessage variant="error">
                    {errors.OPERADORA.message}
                  </FieldMessage>
                )}
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel>Tipo de plano *</FieldLabel>
                <Select
                  value={tipoPlanoValue ?? ""}
                  onValueChange={(v) =>
                    setValue(
                      "TIPO_PLANO",
                      v as "INDIVIDUAL" | "FAMILIAR" | "EMPRESARIAL",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPO_PLANO_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.TIPO_PLANO && (
                  <FieldMessage variant="error">
                    {errors.TIPO_PLANO.message}
                  </FieldMessage>
                )}
              </Field>
              <Field>
                <FieldLabel>Cobertura *</FieldLabel>
                <Select
                  value={coberturaValue ?? ""}
                  onValueChange={(v) =>
                    setValue(
                      "COBERTURA",
                      v as "BASICO" | "INTERMEDIARIO" | "PREMIUM",
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {COBERTURA_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.COBERTURA && (
                  <FieldMessage variant="error">
                    {errors.COBERTURA.message}
                  </FieldMessage>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="PERCENTUAL_FUNCIONARIO">
                  % Funcionário *
                </FieldLabel>
                <Input
                  id="PERCENTUAL_FUNCIONARIO"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="30"
                  {...register("PERCENTUAL_FUNCIONARIO")}
                />
                {errors.PERCENTUAL_FUNCIONARIO && (
                  <FieldMessage variant="error">
                    {errors.PERCENTUAL_FUNCIONARIO.message}
                  </FieldMessage>
                )}
              </Field>
            </div>
          </>
        )}

        {typeValue === "OUTROS" && (
          <Field>
            <FieldLabel htmlFor="VALOR">Valor (R$) *</FieldLabel>
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
        )}

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
              value={statusValue ?? ""}
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
