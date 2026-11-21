import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ConstructionEngine } from './construction.engine.ts';

describe('ConstructionEngine Unit Tests', () => {
  it('deve calcular corretamente os insumos para 50m² de reboco paulista com 10% de perda', () => {
    const result = ConstructionEngine.calculate({
      serviceType: 'REBOCO',
      areaM2: 50,
      thicknessMm: 15,
      lossMarginPercent: 10,
    });

    assert.strictEqual(result.serviceType, 'REBOCO');
    assert.strictEqual(result.areaM2, 50);
    assert.ok(result.items.length >= 2, 'Deve ter cimento e areia');
    
    const cement = result.items.find(i => i.id === 'mat-cimento-cpii');
    assert.ok(cement);
    // 50m² * 0.015m = 0.75m³. 0.75 * 7.5 = 5.625 sacos * 1.1 = ~6.18 -> 7 sacos
    assert.ok(cement.finalQuantity > 0);
    assert.ok(result.totalEstimatedPrice > 0);
    assert.ok(result.estimatedLaborDays > 0);
  });

  it('deve calcular corretamente caixas e argamassa AC-III para 40m² de porcelanato', () => {
    const result = ConstructionEngine.calculate({
      serviceType: 'PORCELANATO',
      areaM2: 40,
      lossMarginPercent: 10,
    });

    assert.strictEqual(result.serviceType, 'PORCELANATO');
    // 40 * 1.1 = 44m² / 2.16 = ~20.37 -> 21 caixas
    const tiles = result.items.find(i => i.id === 'mat-porcelanato-60');
    assert.ok(tiles);
    assert.strictEqual(tiles.finalQuantity, 21);

    const mortar = result.items.find(i => i.id === 'mat-argamassa-ac3');
    assert.ok(mortar);
    assert.ok(mortar.finalQuantity >= 13);
  });
});
