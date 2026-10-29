import app from "./app.js";
import { port } from "./config/env.js"
import { verificarConexao } from "./infrastructure/mysql.js";

verificarConexao()
// .listen serve para verificar se a conexão está realmente funcionando

    .then(() => app.listen(port, '0.0.0.0', () => console.log(`GT Store API disponível em: http://localhost:${port}`)))

// Informar se houver erro e identificar qual erro
    .catch((erro) => {
        console.log('Não foi possível iniciar a API', erro);
        process.exitCode = 1;
    });