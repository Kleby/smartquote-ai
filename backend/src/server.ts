import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { QuoteController } from './controllers/quote.controller.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Rotas de Saúde e Status
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    brand: 'Rainha System',
    service: 'SmartQuote AI API',
    version: '1.0.0',
    model: 'Google Gemini 1.5 Flash',
    timestamp: new Date().toISOString(),
  });
});

// Rota Principal de Cotação Inteligente
app.post('/api/v1/quote/calculate', QuoteController.calculate);

// Inicialização
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`👑 [Rainha System] SmartQuote AI API rodando na porta ${PORT}`);
    console.log(`🔗 Healthcheck: http://localhost:${PORT}/api/v1/health`);
    console.log(`🚀 Endpoint de Cotação: POST http://localhost:${PORT}/api/v1/quote/calculate`);
  });
}

export default app;
