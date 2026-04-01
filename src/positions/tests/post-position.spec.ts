import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createPosition,
  initTestDataSource,
} from './helpers/position.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /positions', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um cargo com sucesso (201)', async () => {
    const { status, body } = await createPosition({
      NOME: 'Analista de Sistemas',
      NIVEL: 'Pleno',
      SALARIO_BASE: 7000,
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Analista de Sistemas');
    expect(body.data?.NIVEL).toBe('Pleno');
    expect(body.message).toBe('Cargo criado com sucesso.');
  });

  it('deve retornar 409 quando NOME já existe', async () => {
    await createPosition({ NOME: 'Gerente de TI' });
    const { status, body } = await createPosition({ NOME: 'Gerente de TI' });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createPosition({ NOME: 'Sem Auth' }, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
