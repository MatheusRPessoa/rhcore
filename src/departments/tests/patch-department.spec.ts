import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  initTestDataSource,
} from './helpers/department.helper';

const BASE_URL = 'http://localhost:3000';

describe('PATCH /departments/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar um departamento com sucesso (200)', async () => {
    const created = await createDepartment({ NOME: 'Vendas', SIGLA: 'VND' });
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ NOME: 'Vendas Atualizado' }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Vendas Atualizado');
    expect(body.message).toBe('Departamento atualizado com sucesso');
  });

  it('deve retornar 404 quando departamento não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/departments/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
        body: JSON.stringify({ NOME: 'Qualquer' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch(
      `${BASE_URL}/departments/00000000-0000-0000-0000-000000000000`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ NOME: 'Qualquer' }),
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
