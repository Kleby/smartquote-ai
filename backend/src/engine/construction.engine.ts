import type {
  ConstructionCalculationInput,
  MaterialItemOutput,
  QuoteCalculationResult,
} from '../models/quote.model.ts';

export class ConstructionEngine {
  /**
   * Executa o cálculo determinístico baseado em tabelas de engenharia civil
   */
  public static calculate(input: ConstructionCalculationInput): QuoteCalculationResult {
    const marginMultiplier = 1 + input.lossMarginPercent / 100;

    switch (input.serviceType) {
      case 'REBOCO':
        return this.calculatePlaster(input, marginMultiplier);
      case 'CONTRAPISO':
        return this.calculateSubfloor(input, marginMultiplier);
      case 'PORCELANATO':
        return this.calculateTiles(input, marginMultiplier);
      case 'PINTURA':
        return this.calculatePainting(input, marginMultiplier);
      default:
        throw new Error(`Tipo de serviço não suportado: ${input.serviceType}`);
    }
  }

  // --- 1. REBOCO / EMBOÇO ---
  private static calculatePlaster(
    input: ConstructionCalculationInput,
    margin: number
  ): QuoteCalculationResult {
    const thicknessM = (input.thicknessMm || 15) / 1000;
    const volumeM3 = input.areaM2 * thicknessM;

    // Traço 1:4 -> Para cada m³ de argamassa: ~7.5 sacos de cimento (50kg) e ~1.1 m³ de areia
    const rawCementBags = volumeM3 * 7.5;
    const finalCementBags = Math.ceil(rawCementBags * margin);

    const rawSandM3 = volumeM3 * 1.1;
    const finalSandM3 = Math.max(0.5, Math.ceil((rawSandM3 * margin) * 2) / 2); // múltiplos de 0.5m³

    const items: MaterialItemOutput[] = [
      {
        id: 'mat-cimento-cpii',
        name: 'Cimento CP II-E 50kg (Nassau / Montes Claros)',
        category: 'Aglomerantes',
        baseCalculation: `Traço 1:4 (${rawCementBags.toFixed(1)} sacos calculados para ${volumeM3.toFixed(2)}m³)`,
        calculatedQuantity: Number(rawCementBags.toFixed(2)),
        finalQuantity: finalCementBags,
        unit: 'sacos (50kg)',
        estimatedUnitPrice: 38.50,
        subtotal: Number((finalCementBags * 38.50).toFixed(2)),
      },
      {
        id: 'mat-areia-media',
        name: 'Areia Média Lavada',
        category: 'Agregados',
        baseCalculation: `Volume de ${rawSandM3.toFixed(2)}m³ + margem`,
        calculatedQuantity: Number(rawSandM3.toFixed(2)),
        finalQuantity: finalSandM3,
        unit: 'm³',
        estimatedUnitPrice: 95.00,
        subtotal: Number((finalSandM3 * 95.00).toFixed(2)),
      },
      {
        id: 'mat-aditivo-plastificante',
        name: 'Aditivo Plastificante p/ Argamassa 3.6L',
        category: 'Químicos',
        baseCalculation: '100ml para cada saco de cimento',
        calculatedQuantity: Number((finalCementBags * 0.1).toFixed(2)),
        finalQuantity: Math.ceil(finalCementBags / 30) || 1,
        unit: 'galão (3.6L)',
        estimatedUnitPrice: 42.00,
        subtotal: (Math.ceil(finalCementBags / 30) || 1) * 42.00,
      },
    ];

    const totalEstimatedPrice = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
    const estimatedLaborDays = Math.ceil(input.areaM2 / 20); // ~20m² por dia para pedreiro + servente

    return {
      serviceType: 'REBOCO',
      serviceTitle: `Reboco Paulista Interno/Externo (${input.areaM2}m² - ${input.thicknessMm || 15}mm)`,
      areaM2: input.areaM2,
      lossMarginPercent: input.lossMarginPercent,
      items,
      totalEstimatedPrice,
      totalItemsCount: items.length,
      estimatedLaborDays: Math.max(1, estimatedLaborDays),
      technicalNotes:
        'Traço 1:4 recomendado para áreas secas e molhadas. O aditivo plastificante substitui a cal, aumentando a trabalhabilidade e evitando trincas de retração.',
    };
  }

  // --- 2. CONTRAPISO ---
  private static calculateSubfloor(
    input: ConstructionCalculationInput,
    margin: number
  ): QuoteCalculationResult {
    const thicknessM = (input.thicknessMm || 50) / 1000; // Padrão 5cm
    const volumeM3 = input.areaM2 * thicknessM;

    // Traço 1:4 farofa -> ~6.5 sacos por m³ de contrapiso
    const rawCementBags = volumeM3 * 6.5;
    const finalCementBags = Math.ceil(rawCementBags * margin);

    const rawSandM3 = volumeM3 * 1.15;
    const finalSandM3 = Math.max(0.5, Math.ceil((rawSandM3 * margin) * 2) / 2);

    const isWet = input.customParams?.isWetArea ?? true;
    const items: MaterialItemOutput[] = [
      {
        id: 'mat-cimento-cp-contrapiso',
        name: 'Cimento CP II 50kg',
        category: 'Aglomerantes',
        baseCalculation: `Traço farofa 1:4 (${rawCementBags.toFixed(1)} sacos base)`,
        calculatedQuantity: Number(rawCementBags.toFixed(2)),
        finalQuantity: finalCementBags,
        unit: 'sacos (50kg)',
        estimatedUnitPrice: 38.50,
        subtotal: Number((finalCementBags * 38.50).toFixed(2)),
      },
      {
        id: 'mat-areia-grossa-contrapiso',
        name: 'Areia Média/Grossa Lavada',
        category: 'Agregados',
        baseCalculation: `Volume de ${rawSandM3.toFixed(2)}m³ com compactação`,
        calculatedQuantity: Number(rawSandM3.toFixed(2)),
        finalQuantity: finalSandM3,
        unit: 'm³',
        estimatedUnitPrice: 95.00,
        subtotal: Number((finalSandM3 * 95.00).toFixed(2)),
      },
    ];

    if (isWet) {
      items.push({
        id: 'mat-impermeabilizante',
        name: 'Aditivo Impermeabilizante p/ Concreto 18L',
        category: 'Químicos',
        baseCalculation: '2L a cada saco de cimento para proteção contra umidade',
        calculatedQuantity: Number((finalCementBags * 2).toFixed(1)),
        finalQuantity: Math.ceil((finalCementBags * 2) / 18) || 1,
        unit: 'balde (18L)',
        estimatedUnitPrice: 185.00,
        subtotal: (Math.ceil((finalCementBags * 2) / 18) || 1) * 185.00,
      });
    }

    const totalEstimatedPrice = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
    const estimatedLaborDays = Math.ceil(input.areaM2 / 25);

    return {
      serviceType: 'CONTRAPISO',
      serviceTitle: `Contrapiso Nivelado (${input.areaM2}m² - ${input.thicknessMm || 50}mm)`,
      areaM2: input.areaM2,
      lossMarginPercent: input.lossMarginPercent,
      items,
      totalEstimatedPrice,
      totalItemsCount: items.length,
      estimatedLaborDays: Math.max(1, estimatedLaborDays),
      technicalNotes:
        'Contrapiso preparado em consistência de farofa úmida com caimento de 1% para ralos. O impermeabilizante bloqueia a ascensão de umidade por capilaridade.',
    };
  }

  // --- 3. PORCELANATO E CERÂMICA ---
  private static calculateTiles(
    input: ConstructionCalculationInput,
    margin: number
  ): QuoteCalculationResult {
    const boxCoverageM2 = 2.16; // Padrão caixa porcelanato 60x60
    const totalAreaWithMargin = input.areaM2 * margin;
    const finalBoxes = Math.ceil(totalAreaWithMargin / boxCoverageM2);

    // Consumo argamassa AC-III: ~6kg/m² (dupla colagem)
    const rawMortarBags = (input.areaM2 * 6.5) / 20; // sacos de 20kg
    const finalMortarBags = Math.ceil(rawMortarBags * margin);

    // Consumo de rejunte: ~0.4kg/m²
    const finalGroutKg = Math.ceil((input.areaM2 * 0.4 * margin) / 1) || 2;

    const items: MaterialItemOutput[] = [
      {
        id: 'mat-porcelanato-60',
        name: 'Porcelanato Polido 60x60 Retificado (Cx 2.16m²)',
        category: 'Revestimentos',
        baseCalculation: `${input.areaM2}m² + margem de ${input.lossMarginPercent}% para recortes`,
        calculatedQuantity: Number((totalAreaWithMargin).toFixed(2)),
        finalQuantity: finalBoxes,
        unit: 'caixas (2.16m² cada)',
        estimatedUnitPrice: 114.26, // R$ 52,90/m² * 2.16
        subtotal: Number((finalBoxes * 114.26).toFixed(2)),
      },
      {
        id: 'mat-argamassa-ac3',
        name: 'Argamassa AC-III Cinza 20kg (Quartzolit)',
        category: 'Argamassas Colantes',
        baseCalculation: '6.5 kg/m² considerando dupla colagem',
        calculatedQuantity: Number(rawMortarBags.toFixed(1)),
        finalQuantity: finalMortarBags,
        unit: 'sacos (20kg)',
        estimatedUnitPrice: 39.90,
        subtotal: Number((finalMortarBags * 39.90).toFixed(2)),
      },
      {
        id: 'mat-rejunte-epoxi',
        name: 'Rejunte Epóxi 1kg Branco',
        category: 'Rejuntes',
        baseCalculation: 'Junta fina de 1.5mm',
        calculatedQuantity: Number((input.areaM2 * 0.4).toFixed(1)),
        finalQuantity: finalGroutKg,
        unit: 'potes (1kg)',
        estimatedUnitPrice: 31.75,
        subtotal: Number((finalGroutKg * 31.75).toFixed(2)),
      },
      {
        id: 'mat-espacadores-niveladores',
        name: 'Clipes Espaçadores Niveladores (Pacote 100un)',
        category: 'Acessórios',
        baseCalculation: '~8 clipes por metro quadrado para formato 60x60',
        calculatedQuantity: Math.ceil((input.areaM2 * 8) / 100),
        finalQuantity: Math.ceil((input.areaM2 * 8) / 100) || 1,
        unit: 'pacotes (100 un)',
        estimatedUnitPrice: 28.90,
        subtotal: (Math.ceil((input.areaM2 * 8) / 100) || 1) * 28.90,
      },
    ];

    const totalEstimatedPrice = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
    const estimatedLaborDays = Math.ceil(input.areaM2 / 12); // ~12m² por dia com dupla colagem e niveladores

    return {
      serviceType: 'PORCELANATO',
      serviceTitle: `Assentamento de Porcelanato Retificado (${input.areaM2}m²)`,
      areaM2: input.areaM2,
      lossMarginPercent: input.lossMarginPercent,
      items,
      totalEstimatedPrice,
      totalItemsCount: items.length,
      estimatedLaborDays: Math.max(1, estimatedLaborDays),
      technicalNotes:
        'Para placas acima de 60x60cm, o método de dupla colagem (argamassa no contrapiso e no tardoz da peça) é indispensável para evitar descolamento e som oco.',
    };
  }

  // --- 4. PINTURA ACRÍLICA ---
  private static calculatePainting(
    input: ConstructionCalculationInput,
    margin: number
  ): QuoteCalculationResult {
    const totalArea = input.areaM2 * margin;

    // Tinta: 1 lata de 18L rende ~110m² com 2 demãos
    const finalPaintCans = Math.ceil(totalArea / 110) || 1;

    // Selador: 1 lata de 18L rende ~130m² com 1 demão
    const finalPrimerCans = Math.ceil(totalArea / 130) || 1;

    // Massa corrida: 1 barrica de 25kg rende ~25m² com 2 demãos
    const finalPuttyBarrels = Math.ceil(totalArea / 25) || 1;

    const items: MaterialItemOutput[] = [
      {
        id: 'mat-tinta-acrilica-18l',
        name: 'Tinta Acrílica Fosca Premium 18L (Suvinil/Coral)',
        category: 'Tintas',
        baseCalculation: 'Rendimento de ~110m² por lata para 2 demãos',
        calculatedQuantity: Number((totalArea / 110).toFixed(2)),
        finalQuantity: finalPaintCans,
        unit: 'latas (18L)',
        estimatedUnitPrice: 489.00,
        subtotal: finalPaintCans * 489.00,
      },
      {
        id: 'mat-selador-acrilico',
        name: 'Selador Acrílico Branco 18L',
        category: 'Preparação',
        baseCalculation: '1 demão preparatória para uniformizar absorção',
        calculatedQuantity: Number((totalArea / 130).toFixed(2)),
        finalQuantity: finalPrimerCans,
        unit: 'latas (18L)',
        estimatedUnitPrice: 179.00,
        subtotal: finalPrimerCans * 179.00,
      },
      {
        id: 'mat-massa-corrida',
        name: 'Massa Corrida PVA 25kg',
        category: 'Preparação',
        baseCalculation: '2 demãos para nivelamento e acabamento liso',
        calculatedQuantity: Number((totalArea / 25).toFixed(1)),
        finalQuantity: finalPuttyBarrels,
        unit: 'barricas (25kg)',
        estimatedUnitPrice: 78.00,
        subtotal: finalPuttyBarrels * 78.00,
      },
      {
        id: 'mat-kit-pintura',
        name: 'Kit Pintura Profissional (Rolos, Pincéis, Lixas, Fitas)',
        category: 'Acessórios',
        baseCalculation: 'Consumíveis completos para a metragem',
        calculatedQuantity: 1,
        finalQuantity: 1,
        unit: 'kit completo',
        estimatedUnitPrice: 180.00,
        subtotal: 180.00,
      },
    ];

    const totalEstimatedPrice = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
    const estimatedLaborDays = Math.ceil(input.areaM2 / 30);

    return {
      serviceType: 'PINTURA',
      serviceTitle: `Pintura Acrílica com Preparação Completa (${input.areaM2}m²)`,
      areaM2: input.areaM2,
      lossMarginPercent: input.lossMarginPercent,
      items,
      totalEstimatedPrice,
      totalItemsCount: items.length,
      estimatedLaborDays: Math.max(1, estimatedLaborDays),
      technicalNotes:
        'A aplicação do selador antes da massa corrida economiza até 25% de tinta, além de evitar descascamento futuro.',
    };
  }
}
