import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createVacation,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/vacation.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /vacations', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
    await setupDefaultEmployee();
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve solicitar férias com sucesso (201)', async () => {
    const { status, body } = await createVacation();

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.DIAS_SOLICITADOS).toBe(29);
    expect(body.data?.STATUS_FERIAS).toBe('PENDENTE');
    expect(body.message).toBe('Férias solicitadas com sucesso.');
  });

  it('deve retornar 400 quando DATA_FIM é anterior à DATA_INICIO', async () => {
    const { status, body } = await createVacation({
      DATA_INICIO: '2025-07-30',
      DATA_FIM: '2025-07-01',
    });

    expect(status).toBe(400);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await createVacation({}, false);

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
