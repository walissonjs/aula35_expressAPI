import { AppError } from '../shared/errors.js';
import { validarObrigatorios } from '../validators/resourceValidator.js';

function criarServico(repository, { required = [], ownerField = null, sanitize = (value) => value } = {}) {
  return {
    async listar(user) {
      const items = await repository.findAll();
      return ownerField && user.role !== 'admin' ? items.filter((item) => item[ownerField] === user.id) : items;
    },
    async buscar(id, user) {
      const item = await repository.findById(id);
      if (!item || (ownerField && user.role !== 'admin' && item[ownerField] !== user.id)) {
        throw new AppError('Registro não encontrado', 404);
      }
      return sanitize(item);
    },
    async criar(body, user) {
      validarObrigatorios(body, required);
      const attributes = ownerField ? { ...body, [ownerField]: user.id } : body;
      return repository.create(sanitize(attributes));
    },
    async atualizar(id, body, user) {
      const existing = await this.buscar(id, user);
      const attributes = { ...body };
      if (ownerField) delete attributes[ownerField];
      return repository.update(existing.id, sanitize(attributes));
    },
    async remover(id, user) {
      await this.buscar(id, user);
      await repository.delete(id);
    }
  };
}

export default criarServico;
