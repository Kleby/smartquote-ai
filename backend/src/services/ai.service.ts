import type { ConstructionCalculationInput, ServiceType } from '../models/quote.model.ts';

export interface AiParsedResult {
  serviceType: ServiceType;
  areaM2: number;
  thicknessMm?: number;
  lossMarginPercent: number;
  summary: string;
}

export class GeminiAiService {
  private static readonly API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  /**
   * Converte a descrição em linguagem natural em parâmetros estruturados
   */
  public static async parsePrompt(
    prompt: string,
    defaultMargin: number = 10
  ): Promise<AiParsedResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback inteligente para desenvolvimento local sem chave configurada
    if (!apiKey || apiKey === 'sua_chave_aqui') {
      console.warn('⚠️ GEMINI_API_KEY não configurada. Usando parser heurístico local.');
      return this.heuristicFallback(prompt, defaultMargin);
    }

    const systemInstruction = `
Você é o assistente especialista em orçamentos da Rainha System (materiais de construção).
Analise a mensagem do cliente e extraia os parâmetros estruturados da obra.

Regras rigorosas:
1. Identifique o tipo de serviço:
   - "REBOCO" (para reboco, emboço, chapisco, argamassa de parede)
   - "CONTRAPISO" (para contrapiso, regularização de piso, piso grosso)
   - "PORCELANATO" (para porcelanato, cerâmica, azulejo, piso retificado)
   - "PINTURA" (para pintura, pintar, tinta acrílica, massa corrida)
2. Extraia a área em metros quadrados (areaM2). Se o cliente passar largura x comprimento (ex: 4x5), calcule a área (20). Se não informado, assuma 30.
3. Extraia a espessura em milímetros se informado (ex: 2cm = 20mm, 15mm = 15mm, 5cm = 50mm).
4. Defina a margem de quebra/perda (padrão: ${defaultMargin}%).
5. Retorne ESTRITAMENTE um objeto JSON válido, sem markdown ou explicações.
`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    };

    try {
      const response = await fetch(`${this.API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na Gemini API (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('Resposta vazia da API Gemini');
      }

      const parsed = JSON.parse(content);
      return {
        serviceType: this.normalizeServiceType(parsed.serviceType),
        areaM2: Number(parsed.areaM2) || 30,
        thicknessMm: parsed.thicknessMm ? Number(parsed.thicknessMm) : undefined,
        lossMarginPercent: Number(parsed.lossMarginPercent) || defaultMargin,
        summary: parsed.summary || `Serviço de ${parsed.serviceType} para ${parsed.areaM2}m²`,
      };
    } catch (err) {
      console.error('Falha ao processar com Gemini, usando fallback:', err);
      return this.heuristicFallback(prompt, defaultMargin);
    }
  }

  private static normalizeServiceType(type: string): ServiceType {
    const upper = (type || '').toUpperCase();
    if (upper.includes('REBOCO') || upper.includes('EMBOÇO')) return 'REBOCO';
    if (upper.includes('CONTRAPISO')) return 'CONTRAPISO';
    if (upper.includes('PORCELANATO') || upper.includes('CERAMICA') || upper.includes('PISO')) return 'PORCELANATO';
    if (upper.includes('PINTURA') || upper.includes('TINTA')) return 'PINTURA';
    return 'REBOCO';
  }

  /**
   * Parser heurístico local (Regex) para testes rápidos e desenvolvimento offline
   */
  public static heuristicFallback(prompt: string, defaultMargin: number): AiParsedResult {
    const lower = prompt.toLowerCase();

    // 1. Identificar Serviço
    let serviceType: ServiceType = 'REBOCO';
    if (lower.includes('porcelanato') || lower.includes('cerâmica') || lower.includes('ceramica') || lower.includes('azulejo')) {
      serviceType = 'PORCELANATO';
    } else if (lower.includes('contrapiso') || lower.includes('piso grosso')) {
      serviceType = 'CONTRAPISO';
    } else if (lower.includes('pintura') || lower.includes('pintar') || lower.includes('tinta') || lower.includes('massa corrida')) {
      serviceType = 'PINTURA';
    } else if (lower.includes('reboco') || lower.includes('emboço') || lower.includes('emboco')) {
      serviceType = 'REBOCO';
    }

    // 2. Extrair Área em m² (ex: "10x5", "6x7 metros", "50m2", "50 m²", "40 metros quadrados")
    let areaM2 = 30; // fallback padrão
    const dimensionMatch = prompt.match(/(\d+(?:[.,]\d+)?)\s*(?:x|\*)\s*(\d+(?:[.,]\d+)?)/i);
    const m2Match = prompt.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|m2|metros\s*quadrados|metros)/i);

    if (dimensionMatch) {
      const l1 = parseFloat(dimensionMatch[1].replace(',', '.'));
      const l2 = parseFloat(dimensionMatch[2].replace(',', '.'));
      areaM2 = l1 * l2;
    } else if (m2Match) {
      areaM2 = parseFloat(m2Match[1].replace(',', '.'));
    }

    // 3. Extrair espessura (ex: "15mm", "2cm", "5cm")
    let thicknessMm: number | undefined;
    const mmMatch = prompt.match(/(\d+)\s*mm/i);
    const cmMatch = prompt.match(/(\d+)\s*cm/i);
    if (mmMatch) {
      thicknessMm = parseInt(mmMatch[1], 10);
    } else if (cmMatch) {
      thicknessMm = parseInt(cmMatch[1], 10) * 10;
    }

    return {
      serviceType,
      areaM2: Math.max(1, areaM2),
      thicknessMm,
      lossMarginPercent: defaultMargin,
      summary: `Identificado: ${serviceType} com área aproximada de ${areaM2}m²`,
    };
  }
}
