import { AppError } from '../shared/errors.js';

export function validarObrigatorios(body = {}, required = []) {
  const faltantes = required.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (faltantes.length > 0) {
    throw new AppError(`Campos obrigatórios ausentes: ${faltantes.join(', ')}`, 400);
  }
}
