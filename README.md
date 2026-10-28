# Desenho da Arquitetura

A API GT Store é uma aplicação Express modular, organizada por domínio e camadas, com
persistência em um banco MySQL local. O Docker Compose é apenas uma opção de ambiente local
para esta máquina e não é uma dependência obrigatória do projeto.

## Arquitetura da Aplicação

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart TD
    subgraph Client["Camada de Cliente"]
        Insomnia["Insomnia ou cliente HTTP"]
    end
    subgraph Api["Camada de API - Express"]
        Routes["Rotas por dominio"]
        Middleware["Middlewares de auth e erro"]
        Controllers["Controllers HTTP"]
    end
    subgraph Business["Camada de Negócio"]
        Services["Services de domínio"]
        Validators["Validadores de entrada"]
    end
    subgraph Data["Camada de Dados"]
        Repositories["Repositories MySQL"]
        Database[("Banco MySQL local")]
    end
    subgraph Runtime["Infraestrutura Local"]
        Docker["Docker Compose opcional"]
        AdminSeed["Seed do administrador"]
    end

    Insomnia -->|"Requisições HTTP"| Routes
    Routes -->|"Passa por"| Middleware
    Middleware -->|"Encaminha"| Controllers
    Controllers -->|"Chama"| Services
    Services -->|"Valida entrada"| Validators
    Services -->|"Persiste dados"| Repositories
    Repositories -->|"Consultas SQL"| Database
    Docker -.->|"Pode executar"| Database
    AdminSeed -->|"Cria admin"| Repositories
~~~

### Resumo da Pilha Tecnológica

| Camada | Tecnologia | Versão | Finalidade |
|---|---|---:|---|
| Execução | Node.js | 18+ | Executa a API |
| Framework web | Express | 4.21 | Servidor HTTP e roteamento |
| Módulos | JavaScript ESM | Nativo | Imports e exports |
| Autenticação | JSON Web Token | 9.0 | Cria e valida tokens |
| Senhas | bcryptjs | 2.4 | Gera hashes de senhas |
| Driver de banco | mysql2 | 3.11 | Conecta ao MySQL |
| Banco de dados | MySQL | 8.4 | Armazena os dados |
| Ambiente local opcional | Docker Compose | Atual | Executa MySQL nesta máquina |
| Cliente de API | Insomnia | Atual | Executa requisições |

### Armazenamento de Dados e Serviços Externos

O MySQL local armazena usuários, endereços, produtos, carrinhos e pedidos. Cada ambiente pode
usar uma instalação local do MySQL configurada pelo `.env`. Nesta máquina, o Docker Compose
facilita a execução desse banco e inicializa o schema de `docker/mysql/init.sql`. A aplicação
não usa API externa, broker de mensagens, cache ou persistência em arquivos.

### Decisões Arquiteturais

- Usa rotas por domínio com fluxo em camadas até os repositories.
- Usa o padrão repository para manter SQL fora de controllers e services.
- Usa chave estrangeira de `addresses.user_id` para `users.id`.

## Relações entre Componentes

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart LR
    subgraph PresentationLayer["Apresentação"]
        cRoutes["Rotas por domínio"]
        cControllers["Controllers"]
    end
    subgraph BusinessLayer["Regras de Negócio"]
        cAuthService["Service de autenticação"]
        cResourceService["Service de recursos"]
        cCartService["Service de carrinho"]
        cOrderService["Service de pedidos"]
        cProductService["Service de produtos"]
        cValidators["Validadores"]
    end
    subgraph DataAccessLayer["Acesso a Dados"]
        cUserRepo["Repository de usuários"]
        cAddressRepo["Repository de endereços"]
        cProductRepo["Repository de produtos"]
        cCartRepo["Repository de carrinho"]
        cOrderRepo["Repository de pedidos"]
    end
    subgraph InfrastructureLayer["Infraestrutura"]
        cAuthMiddleware["Middleware de autenticação"]
        cErrorMiddleware["Middleware de erros"]
        cMySql["Pool MySQL"]
        cMySqlDb[("MySQL local")]
    end

    cRoutes -->|"Encaminha"| cControllers
    cAuthMiddleware -.->|"Protege"| cRoutes
    cErrorMiddleware -.->|"Trata erros"| cControllers
    cControllers -->|"Delega"| cAuthService
    cControllers -->|"Delega"| cResourceService
    cControllers -->|"Delega"| cCartService
    cControllers -->|"Delega"| cOrderService
    cControllers -->|"Delega"| cProductService
    cAuthService -->|"Valida"| cValidators
    cCartService -->|"Valida"| cValidators
    cResourceService -->|"Valida"| cValidators
    cAuthService -->|"Consulta"| cUserRepo
    cAuthService -->|"Cria endereço"| cAddressRepo
    cResourceService -->|"Usa repository"| cUserRepo
    cResourceService -->|"Usa repository"| cAddressRepo
    cProductService -->|"Consulta"| cProductRepo
    cCartService -->|"Consulta"| cCartRepo
    cCartService -->|"Confere estoque"| cProductRepo
    cOrderService -->|"Usa"| cOrderRepo
    cOrderService -->|"Usa"| cCartRepo
    cOrderService -->|"Atualiza estoque"| cProductRepo
    cUserRepo -->|"SQL"| cMySql
    cAddressRepo -->|"SQL"| cMySql
    cProductRepo -->|"SQL"| cMySql
    cCartRepo -->|"SQL"| cMySql
    cOrderRepo -->|"SQL"| cMySql
    cMySql -->|"Consultas"| cMySqlDb
~~~

### Inventário de Componentes

| Componente | Camada | Tipo | Responsabilidade |
|---|---|---|---|
| Rotas por domínio | Apresentação | Router | Mapeiam URLs para controllers |
| Controllers | Apresentação | Adaptador HTTP | Leem requisições e formatam respostas |
| Service de autenticação | Regras de negócio | Service | Cadastra usuários e cria tokens |
| Service de recursos | Regras de negócio | Service | Aplica CRUD e regras de propriedade |
| Service de carrinho | Regras de negócio | Service | Gerencia itens, totais e estoque |
| Service de pedidos | Regras de negócio | Service | Cria pedidos e atualiza estoque |
| Service de produtos | Regras de negócio | Service | Lista e gerencia produtos |
| Validadores | Regras de negócio | Validator | Conferem campos obrigatórios |
| Repository de usuários | Acesso a dados | Repository | Persiste usuários e endereço relacionado |
| Repository de endereços | Acesso a dados | Repository | Persiste endereços dos usuários |
| Repository de produtos | Acesso a dados | Repository | Persiste produtos e estoque |
| Repository de carrinho | Acesso a dados | Repository | Persiste itens JSON e totais |
| Repository de pedidos | Acesso a dados | Repository | Persiste itens JSON e status |
| Middleware de autenticação | Infraestrutura | Middleware | Valida JWT e carrega usuário atual |
| Middleware de erros | Infraestrutura | Middleware | Converte erros em respostas HTTP |
| Pool MySQL | Infraestrutura | Adaptador de banco | Gerencia conexões MySQL |
| MySQL local | Infraestrutura | Banco relacional | Armazena os registros da aplicação |

https://dbdiagram.io/d/gt-store-6ae01ec4aac33014102bc878