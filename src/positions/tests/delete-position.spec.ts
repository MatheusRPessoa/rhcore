import { AppDataSource } from 'src/config/database/data-source';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createPosition,
  initTestDataSource,
} from './helpers/position.helper';

const BASE_URL = 'http://localhost:3000';

describe('DELETE /positions/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve remover um cargo com sucesso (200)', async () => {
    const created = await createPosition({ NOME: 'Cargo Para Deletar' });
    const id = created.body.data!.ID;

    const response = await fetch(`${BASE_URL}/positions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...AuthHelper.getAuthHeader(),
      },
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.message).toBe('Cargo removido com sucesso');
  });

  it('deve retornar 404 quando o cargo não existe', async () => {
    const response = await fetch(
      `${BASE_URL}/positions/00000000-0000-0000-0000-000000000000`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...AuthHelper.getAuthHeader(),
        },
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
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
