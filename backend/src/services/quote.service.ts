import type { QuoteCalculationResult } from '../models/quote.model.ts';
import { ConstructionEngine } from '../engine/construction.engine.ts';
import { GeminiAiService, type AiParsedResult } from './ai.service.ts';

export interface GenerateQuoteRequest {
  prompt: string;
  lossMarginPercent?: number;
}

export interface GenerateQuoteResponse {
  success: boolean;
  aiInterpretation: AiParsedResult;
  calculation: QuoteCalculationResult;
  generatedAt: string;
}

export class QuoteService {
  public static async generateQuote(request: GenerateQuoteRequest): Promise<GenerateQuoteResponse> {
    const margin = request.lossMarginPercent ?? 10;

    // 1. A IA interpreta o texto em linguagem natural
    const parsed = await GeminiAiService.parsePrompt(request.prompt, margin);

    // 2. O motor determinístico calcula as quantidades exatas de material
    const calculation = ConstructionEngine.calculate({
      serviceType: parsed.serviceType,
      areaM2: parsed.areaM2,
      thicknessMm: parsed.thicknessMm,
      lossMarginPercent: parsed.lossMarginPercent,
    });

    return {
      success: true,
      aiInterpretation: parsed,
      calculation,
      generatedAt: new Date().toISOString(),
    };
  }
}
