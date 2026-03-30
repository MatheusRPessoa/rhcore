import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createDepartment,
  initTestDataSource,
} from './helpers/department.helper';

describe('POST /departments', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um departamento com sucesso (201)', async () => {
    const { status, body } = await createDepartment({
      NOME: 'Recursos Humanos',
      SIGLA: 'RH',
    });

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.NOME).toBe('Recursos Humanos');
    expect(body.data?.SIGLA).toBe('RH');
    expect(body.message).toBe('Departamento criado com sucesso.');
  });

  it('deve retornar 409 quando NOME já existe', async () => {
    await createDepartment({ NOME: 'Financeiro', SIGLA: 'FIN' });
    const { status, body } = await createDepartment({
      NOME: 'Financeiro',
      SIGLA: 'FIN2',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 409 quando a SIGLA já existe', async () => {
    await createDepartment({ NOME: 'Marketing', SIGLA: 'MKT' });
    const { status, body } = await createDepartment({
      NOME: 'Marketing 2',
      SIGLA: 'MKT',
    });

    expect(status).toBe(409);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createDepartment(
      { NOME: 'Sem Auth', SIGLA: 'SA' },
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
