import express from 'express';
import routes from './routes/index.js';

const app = express();

app.use(express.json());
app.get('/', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor';
  res.status(statusCode).json({ error: message });
});

export default app;