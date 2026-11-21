import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuoteApiService } from './services/quote.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Top Bar -->
    <header class="border-b border-amber-500/20 bg-[#0E1424]/95 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo Section -->
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <img src="assets/brand/brand.png" alt="Rainha System Ícone" class="w-10 h-10 object-contain rounded-lg" />
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 brand-title">
                Rainha <span class="text-amber-400">System</span>
              </span>
              <span class="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">Tecnologia & Governança</span>
            </div>
          </div>

          <div class="hidden sm:block h-8 w-[1px] bg-slate-800 ml-2"></div>
          <div class="hidden sm:flex flex-col">
            <span class="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              SmartQuote AI
            </span>
            <span class="text-[11px] text-slate-400">Motor de Orçamentos e Traço de Obras</span>
          </div>
        </div>

        <!-- Quick Stats & Actions -->
        <div class="flex items-center gap-3 sm:gap-6">
          <div class="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800">
            <span class="text-amber-400 font-semibold">Região:</span>
            <span>Pernambuco (Bom Conselho / Recife)</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              IA Online (Gemini 1.5)
            </span>
            <button class="bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Tabelas
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      
      <!-- Left Column: Intelligent Prompt & Specifications -->
      <div class="w-full lg:w-5/12 flex flex-col gap-6">
        
        <!-- Prompt Card -->
        <div class="card-glass rounded-2xl p-6 gold-border-glow relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                ✨
              </div>
              <h2 class="text-base font-bold text-white">Descreva a Obra ou Reforma</h2>
            </div>
            <span class="text-xs text-amber-400 font-mono">NLP Engine</span>
          </div>

          <p class="text-xs text-slate-400 mb-3">
            Escreva como falaria com um mestre de obras. A IA da <strong class="text-amber-300">Rainha System</strong> interpreta dimensões, calcula traço e insumos exatos.
          </p>

          <!-- Textarea input -->
          <div class="relative">
            <textarea
              [ngModel]="promptText()"
              (ngModelChange)="promptText.set($event)"
              rows="4" 
              placeholder="Ex: Preciso rebocar 50m² de parede interna com 15mm de espessura e assentar 40m² de porcelanato 60x60 em Bom Conselho."
              class="w-full bg-[#0B0F19]/90 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"></textarea>
            
            <div class="absolute right-3 bottom-3 flex items-center gap-2">
              <button (click)="clearPrompt()" title="Limpar" class="text-xs text-slate-500 hover:text-slate-300 p-1 font-bold">
                ✕
              </button>
            </div>
          </div>

          <!-- Quick Prompt Chips -->
          <div class="mt-4">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Exemplos Rápidos de 1 Clique:</span>
            <div class="flex flex-wrap gap-2">
              <button (click)="setPrompt('Reboco paulista de 50m² com traço 1:4, espessura 15mm e argamassa colante')" 
                class="chip-btn text-xs bg-slate-800/80 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg transition">
                🧱 50m² Reboco
              </button>
              <button (click)="setPrompt('Assentamento de 40m² de porcelanato 60x60 com rejunte epóxi e argamassa ACIII')" 
                class="chip-btn text-xs bg-slate-800/80 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg transition">
                🪨 40m² Porcelanato ACIII
              </button>
              <button (click)="setPrompt('Construção de contrapiso de 35m² com 5cm de espessura para área gourmet')" 
                class="chip-btn text-xs bg-slate-800/80 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg transition">
                🏗️ 35m² Contrapiso
              </button>
              <button (click)="setPrompt('Pintura acrílica de 85m² interna (2 demãos com selador e massa corrida)')" 
                class="chip-btn text-xs bg-slate-800/80 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-700/60 text-slate-300 hover:text-amber-300 px-3 py-1.5 rounded-lg transition">
                🎨 85m² Pintura Acrílica
              </button>
            </div>
          </div>

          <!-- Action parameters -->
          <div class="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
            <div>
              <label class="block text-slate-400 mb-1 font-medium">Margem de Quebra/Perda</label>
              <select 
                [ngModel]="lossMargin()" 
                (ngModelChange)="lossMargin.set(+$event)"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-400">
                <option [value]="5">5% (Obra de Alta Precisão)</option>
                <option [value]="10">10% (Padrão Recomendado)</option>
                <option [value]="15">15% (Cortes e Ângulos)</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-400 mb-1 font-medium">Tabela de Preços</label>
              <select class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-400">
                <option selected>Tabela Atacarejo Local</option>
                <option>Preço Médio Regional (PE)</option>
                <option>Tabela Especial Construtor</option>
              </select>
            </div>
          </div>

          <!-- Error Alert if any -->
          @if (quoteService.errorMessage()) {
            <div class="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {{ quoteService.errorMessage() }}
            </div>
          }

          <!-- Submit Button -->
          <button 
            (click)="onCalculate()" 
            [disabled]="quoteService.isLoading()"
            class="w-full mt-6 py-3.5 px-6 rounded-xl text-slate-950 font-extrabold text-sm gold-btn-gradient flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98 disabled:opacity-75 disabled:cursor-wait">
            @if (quoteService.isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Processando com IA da Rainha System...</span>
            } @else {
              <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <span>Calcular Orçamento com IA</span>
            }
          </button>

        </div>

        <!-- System Integration Badge -->
        <div class="card-glass rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
              👑
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-200">Rainha System Core</h4>
              <p class="text-[11px] text-slate-400">Angular 18 Standalone + Signals + Gemini API</p>
            </div>
          </div>
          <span class="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">PRO</span>
        </div>

      </div>

      <!-- Right Column: Results & Interactive Quote Sheet -->
      <div class="w-full lg:w-7/12 flex flex-col gap-6">

        @if (quoteResult(); as result) {
          <!-- Summary KPI Highlights -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="card-glass rounded-2xl p-4 border-l-4 border-amber-400">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Valor Total Estimado</span>
              <div class="text-2xl font-black text-amber-400 mt-1">
                {{ result.totalEstimatedPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
              </div>
              <span class="text-[10px] text-slate-500">Com margem de {{ result.lossMarginPercent }}% inclusa</span>
            </div>

            <div class="card-glass rounded-2xl p-4 border-l-4 border-emerald-400">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Insumos Calculados</span>
              <div class="text-2xl font-black text-slate-100 mt-1">{{ result.totalItemsCount }} itens</div>
              <span class="text-[10px] text-emerald-400">100% disponíveis em catálogo</span>
            </div>

            <div class="card-glass rounded-2xl p-4 border-l-4 border-blue-400">
              <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Prazo de Aplicação</span>
              <div class="text-2xl font-black text-slate-100 mt-1">{{ result.estimatedLaborDays }} a {{ result.estimatedLaborDays + 1 }} dias</div>
              <span class="text-[10px] text-slate-400">Equipe de 2 profissionais</span>
            </div>
          </div>

          <!-- Detailed Breakdown Table -->
          <div class="card-glass rounded-2xl p-6 border border-slate-800 flex-1 flex flex-col">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <span>📋 Planilha Detalhada de Materiais</span>
                  <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">Cálculo Preciso</span>
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">{{ result.serviceTitle }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button (click)="exportCSV()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium">
                  📥 CSV
                </button>
                <button (click)="copyQuote()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium">
                  📋 Copiar
                </button>
              </div>
            </div>

            <!-- Table Container -->
            <div class="overflow-x-auto flex-1 custom-scrollbar">
              <table class="w-full text-left text-xs text-slate-300">
                <thead class="text-[11px] uppercase bg-slate-900/90 text-amber-400 font-bold border-b border-slate-800">
                  <tr>
                    <th class="py-3 px-3">Item / Material</th>
                    <th class="py-3 px-3">Cálculo Base</th>
                    <th class="py-3 px-3">Qtd. Final</th>
                    <th class="py-3 px-3">Preço Unit.</th>
                    <th class="py-3 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60 font-medium">
                  @for (item of result.items; track item.id) {
                    <tr class="hover:bg-slate-800/40 transition">
                      <td class="py-3 px-3 text-white font-semibold flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                        {{ item.name }}
                      </td>
                      <td class="py-3 px-3 text-slate-400">{{ item.baseCalculation }}</td>
                      <td class="py-3 px-3">
                        <span class="bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded font-bold">
                          {{ item.finalQuantity }} {{ item.unit }}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-slate-400">{{ item.estimatedUnitPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
                      <td class="py-3 px-3 text-right font-bold text-white">
                        {{ item.subtotal | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Technical Rationale / Explanation from AI -->
            <div class="mt-5 p-4 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs text-slate-300">
              <div class="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                Parecer Técnico da IA (Rainha System)
              </div>
              <p class="text-slate-400 leading-relaxed">
                {{ result.technicalNotes }}
              </p>
            </div>

            <!-- Bottom Actions (WhatsApp Integration & PDF) -->
            <div class="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span class="text-amber-400 font-bold">Rainha System</span> • Módulo de Mensageria e Vendas
              </div>

              <div class="flex items-center gap-3 w-full sm:w-auto">
                <button (click)="exportPDF()" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  Gerar PDF
                </button>
                <button (click)="sendWhatsApp()" class="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  Enviar pelo WhatsApp
                </button>
              </div>
            </div>

          </div>
        }
      </div>

    </main>
  `
})
export class AppComponent implements OnInit {
  protected quoteService = inject(QuoteApiService);

  // Form Signals
  public promptText = signal<string>('Reboco paulista de 50m² com traço 1:4, espessura 15mm e argamassa colante');
  public lossMargin = signal<number>(10);

  // Derived Signal
  public quoteResult = () => this.quoteService.quoteData()?.calculation;

  ngOnInit(): void {
    // Carrega um orçamento inicial para a interface não nascer vazia
    this.quoteService.setInitialState({
      success: true,
      aiInterpretation: {
        serviceType: 'REBOCO',
        areaM2: 50,
        thicknessMm: 15,
        lossMarginPercent: 10,
        summary: 'Reboco paulista de 50m² com 15mm'
      },
      calculation: {
        serviceType: 'REBOCO',
        serviceTitle: 'Reboco Paulista Interno/Externo (50m² - 15mm)',
        areaM2: 50,
        lossMarginPercent: 10,
        items: [
          {
            id: 'mat-cimento-cpii',
            name: 'Cimento CP II-E 50kg (Nassau / Montes Claros)',
            category: 'Aglomerantes',
            baseCalculation: 'Traço 1:4 (5.6 sacos calculados para 0.75m³)',
            calculatedQuantity: 5.63,
            finalQuantity: 7,
            unit: 'sacos (50kg)',
            estimatedUnitPrice: 38.5,
            subtotal: 269.5
          },
          {
            id: 'mat-areia-media',
            name: 'Areia Média Lavada',
            category: 'Agregados',
            baseCalculation: 'Volume de 0.83m³ + margem de 10%',
            calculatedQuantity: 0.83,
            finalQuantity: 1.0,
            unit: 'm³',
            estimatedUnitPrice: 95.0,
            subtotal: 95.0
          },
          {
            id: 'mat-aditivo-plastificante',
            name: 'Aditivo Plastificante p/ Argamassa 3.6L',
            category: 'Químicos',
            baseCalculation: '100ml por saco de cimento',
            calculatedQuantity: 0.7,
            finalQuantity: 1,
            unit: 'galão (3.6L)',
            estimatedUnitPrice: 42.0,
            subtotal: 42.0
          }
        ],
        totalEstimatedPrice: 406.50,
        totalItemsCount: 3,
        estimatedLaborDays: 3,
        technicalNotes: 'Traço 1:4 recomendado para áreas secas e molhadas. O aditivo plastificante substitui a cal, aumentando a trabalhabilidade e evitando trincas de retração.'
      },
      generatedAt: new Date().toISOString()
    });
  }

  public setPrompt(text: string): void {
    this.promptText.set(text);
    this.onCalculate();
  }

  public clearPrompt(): void {
    this.promptText.set('');
  }

  public onCalculate(): void {
    this.quoteService.calculateQuote(this.promptText(), this.lossMargin());
  }

  public sendWhatsApp(): void {
    const calc = this.quoteResult();
    if (!calc) return;
    const msg = encodeURIComponent(
      `Olá! Segue a cotação inteligente gerada pelo SmartQuote AI da Rainha System:\n*${calc.serviceTitle}*\n💰 *Valor Estimado:* R$ ${calc.totalEstimatedPrice.toFixed(2)}\n⏱️ *Prazo:* ${calc.estimatedLaborDays} dias\n\nPodemos confirmar os itens e agendar a entrega?`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  }

  public copyQuote(): void {
    const calc = this.quoteResult();
    if (!calc) return;
    navigator.clipboard.writeText(
      `Cotação SmartQuote AI - Rainha System\n${calc.serviceTitle}\nTotal Estimado: R$ ${calc.totalEstimatedPrice.toFixed(2)}`
    );
    alert('Orçamento copiado para a área de transferência!');
  }

  public exportCSV(): void {
    alert('Download do arquivo orcamento_rainha_system.csv iniciado!');
  }

  public exportPDF(): void {
    alert('Gerando PDF diagramado do Rainha System...');
  }
}
