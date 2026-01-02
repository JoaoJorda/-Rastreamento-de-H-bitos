
import { GoogleGenAI, Type } from "@google/genai";
import { Habit, DailyLog, ReportData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDailyFeedback(habits: Habit[], logs: DailyLog) {
  const completed = habits.filter(h => logs.completions[h.id]).map(h => h.name);
  const missed = habits.filter(h => !logs.completions[h.id]).map(h => h.name);

  const prompt = `ATUE COMO: Analista de Performance Pessoal Sênior.
  CONTEXTO: O usuário acabou de registrar seus hábitos do dia.
  
  DADOS DO DIA:
  - SUCESSOS: ${completed.length > 0 ? completed.join(', ') : 'Nenhum hábito concluído'}
  - FALHAS: ${missed.length > 0 ? missed.join(', ') : 'Nenhuma falha registrada'}
  
  TAREFAS:
  1. Se houve 100% de sucesso, dê um feedback de "Alta Performance" focado em manutenção de momentum.
  2. Se houve falhas, identifique o impacto potencial dessas falhas na semana.
  3. Seja direto, analítico e use um tom que misture psicologia comportamental com gestão de negócios.
  
  LIMITE: No máximo 3 frases. Idioma: Português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Dados registrados com sucesso. O Analista recomenda manter a disciplina para os próximos blocos de tempo.";
  }
}

export async function getMonthlyAnalysis(reportData: ReportData[], month: string) {
  const dataStr = reportData.map(d => `${d.name}: ${d.successRate.toFixed(1)}% de consistência (${d.completedDays}/${d.totalDays} dias)`).join('\n');
  
  const prompt = `ATUE COMO: Consultor de Performance e Gestão de Hábitos.
  OBJETIVO: Analisar o desempenho do mês de ${month}.
  
  MÉTRICAS BRUTAS:
  ${dataStr}
  
  ESTRUTURA DO RELATÓRIO:
  1. RESUMO EXECUTIVO: Uma frase sobre o nível geral de disciplina (Baixo/Médio/Alto).
  2. ANÁLISE DO CAMPEÃO: Por que o hábito com maior taxa foi bem sucedido?
  3. PLANO DE AÇÃO PARA O CRÍTICO: Para o hábito com menor taxa, sugira uma mudança técnica (ex: empilhamento de hábitos ou mudança de ambiente).
  4. INSIGHT PSICOLÓGICO: Uma observação sobre a correlação entre os hábitos.
  
  TOM: Profissional, clínico, direto e focado em resultados. Sem clichês motivacionais vazios.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "O relatório de performance não pôde ser gerado pela IA, mas seus números indicam que você está no caminho da consistência.";
  }
}
