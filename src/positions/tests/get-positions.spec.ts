import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createPosition,
  getAllPositions,
  initTestDataSource,
} from './helpers/position.helper';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';

describe('GET /positions', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve listar cargos com sucesso (200)', async () => {
    await createPosition({ NOME: 'Desenvolvedor Senior' });

    const { status, body } = await getAllPositions();

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data!.length).toBeGreaterThan(0);
    expect(body.message).toBe('Cargos listados com sucesso.');
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const response = await fetch('http://localhost:3000/positions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
