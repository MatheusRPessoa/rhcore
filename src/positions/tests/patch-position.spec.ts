import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createPosition,
  initTestDataSource,
} from './helpers/position.helper';

const BASE_URL = 'http://localhost:3000';

describe('PATCH /positions/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve atualizar um cargo com sucesso (200)', async () => {
    const created = await createPosition({ NOME: 'Analista Junior' });
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/positions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
      body: JSON.stringify({ NOME: 'Analista Junior Atualizado' }),
    });

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Analista Junior Atualizado');
    expect(body.message).toBe('Cargo atualizado com sucesso.');
  });

  it('deve retornar 404 quando o cargo não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/positions/00000000-0000-0000-0000-000000000000`,
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
      `${BASE_URL}/positions/00000000-0000-0000-0000-000000000000`,
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
