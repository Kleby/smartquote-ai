import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenerateQuoteResponse } from '../models/quote.model';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuoteApiService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3001/api/v1/quote/calculate';

  // Signals de estado reativo
  public readonly isLoading = signal<boolean>(false);
  public readonly quoteData = signal<GenerateQuoteResponse | null>(null);
  public readonly errorMessage = signal<string | null>(null);

  /**
   * Envia o prompt em linguagem natural para o backend processar com Gemini + Engine
   */
  public calculateQuote(prompt: string, lossMarginPercent: number = 10): void {
    if (!prompt.trim()) {
      this.errorMessage.set('Por favor, informe a descrição da obra.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http
      .post<GenerateQuoteResponse>(this.API_URL, {
        prompt: prompt.trim(),
        lossMarginPercent,
      })
      .pipe(
        tap((response) => {
          this.quoteData.set(response);
          this.isLoading.set(false);
        }),
        catchError((err) => {
          console.error('Erro na chamada da API:', err);
          this.errorMessage.set(
            'Não foi possível conectar à API do SmartQuote. Certifique-se de que o backend está rodando na porta 3001.'
          );
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Permite preencher dados iniciais ou mockados para visualização imediata
   */
  public setInitialState(mock: GenerateQuoteResponse): void {
    this.quoteData.set(mock);
  }
}
