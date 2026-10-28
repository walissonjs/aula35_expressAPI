// Esse código vai validar a exibição de todos os itens de produtos com base no Id do usuário, neste caso o ID ADMIN deverá exibir todos os itens, se não, apenas os produtos definidos pelo próprio usuário. 


function criarServico(repository,
    { required = [], ownerFild = null, sanitize = (value) => value } = {} ) {
        return {
            async listar(user) {
                const items = await repository.findAll(); //Listar todos os usuários |  Contexto, apenas o usuário adminstrativo deverá ter acesso a listagem
                return ownerFild && use.role !== 'admin'
                ? items.filter((item) => [ownerFild] === user.id)
                : items;
        }
    }

}

export default criarServico;