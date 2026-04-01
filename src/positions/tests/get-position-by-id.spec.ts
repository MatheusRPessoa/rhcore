import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import { AppDataSource } from '../../config/database/data-source';
import {
  cleanupAll,
  createPosition,
  getPositionById,
  initTestDataSource,
} from './helpers/position.helper';

describe('GET /positions/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve retornar um cargo pelo ID (200)', async () => {
    const created = await createPosition({ NOME: 'Designer UX' });
    const id = created.body.data!.ID;

    const { status, body } = await getPositionById(id, true);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.ID).toBe(id);
    expect(body.message).toBe('Cargo encontrado com sucesso.');
  });

  it('deve retornar 404 quando o cargo não existe', async () => {
    const { status, body } = await getPositionById(
      '00000000-0000-0000-0000-000000000000',
      true,
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getPositionById(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
