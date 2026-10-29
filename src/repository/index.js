import createMySqlRepository from './mysqlRepository.js';
import asyncRouter from '../routes/asyncRouter';
import { users } from '../repository';
import express from 'express'

export const users = createMySqlRepository ('users');
export const addresses = createMySqlRepository ('addresses');
export const products = createMySqlRepository ('products');
export const carts = createMySqlRepository ('carts');
export const orders = createMySqlRepository ('orders');
