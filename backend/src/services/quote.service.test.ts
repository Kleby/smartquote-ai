import { describe, it } from 'node:test';
import assert from 'node:assert';
import { QuoteService } from './quote.service.ts';

describe('QuoteService Integration Tests', () => {
  it('deve orquestrar IA e cálculo para texto em linguagem natural de reboco', async () => {
    const response = await QuoteService.generateQuote({
      prompt: 'Preciso fazer um reboco paulista de 50m² com 15mm de espessura',
      lossMarginPercent: 10,
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.aiInterpretation.serviceType, 'REBOCO');
    assert.strictEqual(response.aiInterpretation.areaM2, 50);
    assert.strictEqual(response.aiInterpretation.thicknessMm, 15);
    
    assert.strictEqual(response.calculation.serviceType, 'REBOCO');
    assert.ok(response.calculation.totalEstimatedPrice > 0);
    assert.ok(response.calculation.items.length >= 3);
  });

  it('deve identificar corretamente assentamento de porcelanato com dimensões 6x7', async () => {
    const response = await QuoteService.generateQuote({
      prompt: 'Vou colocar porcelanato retificado numa sala de 6x7 metros com rejunte epoxi',
      lossMarginPercent: 10,
    });

    assert.strictEqual(response.success, true);
    assert.strictEqual(response.aiInterpretation.serviceType, 'PORCELANATO');
    assert.strictEqual(response.aiInterpretation.areaM2, 42); // 6 * 7
    assert.strictEqual(response.calculation.serviceType, 'PORCELANATO');
    assert.ok(response.calculation.items.some(i => i.id === 'mat-porcelanato-60'));
  });
});
