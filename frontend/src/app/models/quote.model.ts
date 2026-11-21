export type ServiceType = 'REBOCO' | 'CONTRAPISO' | 'PORCELANATO' | 'PINTURA';

export interface MaterialItemOutput {
  id: string;
  name: string;
  category: string;
  baseCalculation: string;
  calculatedQuantity: number;
  finalQuantity: number;
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

export interface AiInterpretation {
  serviceType: ServiceType;
  areaM2: number;
  thicknessMm?: number;
  lossMarginPercent: number;
  summary: string;
}

export interface GenerateQuoteResponse {
  success: boolean;
  aiInterpretation: AiInterpretation;
  calculation: QuoteCalculationResult;
  generatedAt: string;
}
