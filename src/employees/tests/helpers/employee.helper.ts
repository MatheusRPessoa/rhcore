import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { ApiResponse } from 'src/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3000';
const EMPLOYEES_ENDPOINT = '/employees';

let dataSource: DataSource = null!;

export interface EmployeeData {
  ID: string;
  MATRICULA: string;
  NOME: string;
  CPF: string;
  RG: string | null;
  DATA_NASCIMENTO: string;
  EMAIL: string;
  TELEFONE: string | null;
  DATA_ADMISSAO: string;
  CRIADO_POR: string;
  CRIADO_EM: string;
  DEPARTAMENTO: { ID: string; NOME: string } | null;
  CARGO: { ID: string; NOME: string } | null;
  GESTOR: { ID: string; NOME: string; MATRICULA: string } | null;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createEmployee(
  overrides?: Partial<{
    MATRICULA: string;
    NOME: string;
    CPF: string;
    EMAIL: string;
    DATA_NASCIMENTO: string;
    DATA_ADMISSAO: string;
  }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData> }> {
  const payload = {
    MATRICULA: overrides?.MATRICULA ?? '2025001',
    NOME: overrides?.NOME ?? 'João da Silva',
    CPF: overrides?.CPF ?? '123.456.789-00',
    EMAIL: overrides?.EMAIL ?? 'joao.silva@empresa.com.br',
    DATA_NASCIMENTO: overrides?.DATA_NASCIMENTO ?? '1990-05-20',
    DATA_ADMISSAO: overrides?.DATA_ADMISSAO ?? '2025-01-15',
  };

  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<EmployeeData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllEmployees(): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<EmployeeData[]>;
}> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthHelper.getAuthHeader(),
    },
  });

  const data = (await response.json()) as ApiResponse<EmployeeData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllEmployeeById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<EmployeeData> }> {
  const response = await fetch(`${BASE_URL}${EMPLOYEES_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<EmployeeData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Data source não iniciado');
  await dataSource.query('TRUNCATE TABLE "FUNCIONARIOS" CASCADE');
}
