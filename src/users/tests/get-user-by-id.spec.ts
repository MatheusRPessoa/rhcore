import { AppDataSource } from '../../config/database/data-source';
import { AuthHelper } from '../../auth/tests/helpers/auth.helper';
import {
  cleanupAll,
  createUser,
  getUserById,
  initTestDataSource,
} from './helpers/user.helper';

describe('GET /users/:id', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve retornar um usuário pelo ID (200)', async () => {
    const created = await createUser({
      NOME_USUARIO: 'busca-user',
      EMAIL: 'busca@email.com.br',
      SENHA: 'senha123',
    });
    const userId = created.body.data!.ID;

    const { status, body } = await getUserById(userId);

    expect(status).toBe(200);
    expect(body.succeeded).toBe(true);
    expect(body.data?.ID).toBe(userId);
    expect(body.message).toBe('Usuário encontrado com sucesso.');
  });

  it('deve retornar 404 quando usuário não existe', async () => {
    const { status, body } = await getUserById(
      '00000000-0000-0000-0000-000000000000',
    );

    expect(status).toBe(404);
    expect(body.succeeded).toBe(false);
  });

  it('deve retornar 401 quando não autenticado', async () => {
    const { status, body } = await getUserById(
      '00000000-0000-0000-0000-000000000000',
      false,
    );

    expect(status).toBe(401);
    expect(body.succeeded).toBe(false);
  });
});
