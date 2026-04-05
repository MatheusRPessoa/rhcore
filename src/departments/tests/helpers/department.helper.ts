import { AuthHelper } from '../../../auth/tests/helpers/auth.helper';
import { ApiResponse } from '../../../common/tests/helpers/api-response.helper';
import { DataSource } from 'typeorm';

const BASE_URL = 'http://localhost:3000';
const DEPARTMENTS_ENDPOINT = '/departments';

let dataSource: DataSource = null!;

export interface DepartmentData {
  ID: string;
  NOME: string;
  SIGLA: string;
  DESCRICAO: string | null;
  CRIADO_POR: string;
  CRIADO_EM: string;
  DEPARTAMENTO_PAI: DepartmentData | null;
}

export function initTestDataSource(ds: DataSource) {
  dataSource = ds;
}

export async function createDepartment(
  overrides?: Partial<{ NOME: string; SIGLA: string; DESCRICAO: string }>,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<DepartmentData> }> {
  const payload = {
    NOME: overrides?.NOME ?? 'Tecnologia da informação',
    SIGLA: overrides?.SIGLA ?? 'TI',
    DESCRICAO: overrides?.DESCRICAO,
  };

  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ApiResponse<DepartmentData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getAllDepartments(): Promise<{
  status: number;
  ok: boolean;
  body: ApiResponse<DepartmentData[]>;
}> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthHelper.getAuthHeader(),
    },
  });
  const data = (await response.json()) as ApiResponse<DepartmentData[]>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function getDepartmentsById(
  id: string,
  authenticated = true,
): Promise<{ status: number; ok: boolean; body: ApiResponse<DepartmentData> }> {
  const response = await fetch(`${BASE_URL}${DEPARTMENTS_ENDPOINT}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated ? AuthHelper.getAuthHeader() : {}),
    },
  });

  const data = (await response.json()) as ApiResponse<DepartmentData>;
  return {
    status: response.status,
    ok: response.ok,
    body: data,
  };
}

export async function cleanupAll() {
  if (!dataSource) throw new Error('Datasource não inicializado');
  await dataSource.query('TRUNCATE TABLE "DEPARTAMENTOS" CASCADE');
}
