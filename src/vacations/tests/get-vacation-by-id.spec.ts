import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createVacation,
  getVacationById,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/vacation.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';
import { exec } from 'child_process';

describe('GET /vacations/:id', () => {
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

  it('deve buscar férias por ID com sucesso (200)', async () => {
    const created = await createVacation();
    const id = created.body.data!.ID;

    const { status, body } = await getVacationById(id);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.ID).toBe(id);
    expect(body.message).toBe('Férias encontradas com sucesso.');
  });

  it('deve retornar 404 quando férias não existem', async () => {
    const { status, body } = await getVacationById(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getVacationById(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
