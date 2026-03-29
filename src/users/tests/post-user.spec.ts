import { AppDataSource } from 'src/config/database/data-source';
import {
  cleanupAll,
  createUser,
  initTestDataSource,
} from './helpers/user.helper';
import { AuthHelper } from 'src/auth/tests/helpers/auth.helper';

describe('POST /users', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    initTestDataSource(AppDataSource);
    await AuthHelper.setup(AppDataSource);
  });

  afterAll(async () => {
    await cleanupAll();
    await AppDataSource.destroy();
  });

  it('deve criar um usuário com sucesso (201)', async () => {
    const { status, body } = await createUser({
      NOME_USUARIO: 'novo_usuario',
      EMAIL: 'novo@email.com.br',
      SENHA: 'senha123',
    });
    console.log('RESPONSE BODY:', JSON.stringify(body, null, 2));

    expect(status).toBe(201);
    expect(body.succeeded).toBe(true);
    expect(body.data).toBeDefined();
  });
});
