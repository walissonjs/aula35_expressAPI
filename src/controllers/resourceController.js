import criarServico from '../services/resourceService.js';

function createResourceController(repository, options = {}) {
  const service = criarServico(repository, options);
  return {

    async list(req, res) {
      res.json(await service.listar(req.user));
    },

    async get(req, res) {
      res.json(await service.buscar(req.params.id, req.user));
    },

    async create(req, res) {
      res.status(201).json(await service.criar(req.body, req.user));
    },

    async update(req, res) {
      res.json(await service.atualizar(req.params.id, req.body, req.user));
    },
    
    async remove(req, res) {
      await service.remover(req.params.id, req.user);
      res.status(204).send();
    }
  };
}

export default createResourceController;
