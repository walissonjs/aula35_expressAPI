// const express = require('express'); type commonjs
import express from 'express';
import routes from './routes';

const app = express()
app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes)


export default app;