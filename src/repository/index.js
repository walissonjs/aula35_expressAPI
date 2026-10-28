import createMySqlRepository from './mysqlRepository.json';

export const users = createMySqlRepository ('users');
export const addresses = createMySqlRepository ('addresses');
export const products = createMySqlRepository ('products');
export const carts = createMySqlRepository ('carts');
export const orders = createMySqlRepository ('orders');
