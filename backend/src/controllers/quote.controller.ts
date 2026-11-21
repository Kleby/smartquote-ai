import type { Request, Response } from 'express';
import { QuoteService } from '../services/quote.service.ts';

export class QuoteController {
  public static async calculate(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, lossMarginPercent } = req.body;

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'O campo "prompt" é obrigatório e deve conter a descrição da obra.',
        });
        return;
      }

      const margin = lossMarginPercent !== undefined ? Number(lossMarginPercent) : 10;
      if (isNaN(margin) || margin < 0 || margin > 50) {
        res.status(400).json({
          success: false,
          error: 'A margem de perda deve ser um número entre 0% e 50%.',
        });
        return;
      }

      const result = await QuoteService.generateQuote({
        prompt: prompt.trim(),
        lossMarginPercent: margin,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao gerar orçamento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao processar a cotação com IA.',
      });
    }
  }
}
