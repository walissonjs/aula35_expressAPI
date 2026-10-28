import app from "./app.js";
import { port } from "./config/env.js"
import { verificarConexao } from "./infrastructure/mysql.js";

verificarConexao()
// .listen serve para verificar se a conexão está realmente funcionando

    .then(() => app.listen(port, () => console.log(`GT Store API disponível em: https://localhost:${port}`)))

// Informar se houver erro e identificar qual erro
    .catch((erro) => {
        console.log('Não foi possível iniciar a API', erro);
        process.exitCode = 1;
    });