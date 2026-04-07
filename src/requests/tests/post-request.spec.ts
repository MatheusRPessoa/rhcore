import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createRequest,
  initTestDataSource,
  setupDefaultEmployee,
} from './helpers/request.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /requests', () => {
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

  it('deve criar uma solicitação com sucesso (201)', async () => {
    const { status, body } = await createRequest();

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data?.TIPO).toBe('DOCUMENTO');
    expect(body.message).toBe('Solicitação criada com sucesso.');
  });
});
