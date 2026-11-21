export type ServiceType = 'REBOCO' | 'CONTRAPISO' | 'PORCELANATO' | 'PINTURA';

export interface ConstructionCalculationInput {
  serviceType: ServiceType;
  areaM2: number;
  thicknessMm?: number;
  lossMarginPercent: number; // e.g., 5, 10, 15
  customParams?: {
    tileSizeCm?: number; // e.g. 60 for 60x60
    isDoubleGluing?: boolean; // Dupla colagem para peças grandes
    isWetArea?: boolean; // Área molhada/externa (pede impermeabilizante)
    paintLayers?: number; // Número de demãos (padrão: 2)
  };
}

export interface MaterialItemOutput {
  id: string;
  name: string;
  category: string;
  baseCalculation: string; // Explicação da fórmula para o usuário
  calculatedQuantity: number;
  finalQuantity: number; // Quantidade comercial arredondada para cima
  unit: string;
  estimatedUnitPrice: number;
  subtotal: number;
}

export interface QuoteCalculationResult {
  serviceType: ServiceType;
  serviceTitle: string;
  areaM2: number;
  lossMarginPercent: number;
  items: MaterialItemOutput[];
  totalEstimatedPrice: number;
  totalItemsCount: number;
  estimatedLaborDays: number;
  technicalNotes: string;
}
