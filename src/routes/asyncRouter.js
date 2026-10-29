export default (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// VAi lidar com todas as informações assíncronas da aplicação /// É uma forma de tornar a aplicação mais perfomática
// O código acima vai tratar com requisições, resoluções e próximo, ou seja, verificação de erros