
import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry, Goal, AnalysisReport } from "../types";

export const analyzeDiscourse = async (
  entries: JournalEntry[], 
  goals: Goal[],
  dateRange: { start: string, end: string }
): Promise<Partial<AnalysisReport>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  
  const entriesText = entries
    .map(e => `[Fecha: ${new Date(e.createdAt).toLocaleDateString('es-AR')}]: ${e.text}`)
    .join('\n\n');
    
  parts.push({ text: `Fragmentos del discurso del analizante para su análisis clínico:\n${entriesText}` });

  entries.forEach(entry => {
    entry.media?.forEach(m => {
      if (m.type === 'image' || m.type === 'drawing') {
        parts.push({
          inlineData: {
            mimeType: m.mimeType,
            data: m.data.split(',')[1]
          }
        });
      }
    });
  });

  const goalsText = goals.length > 0 
    ? goals.map(g => `- ${g.text} (${g.completed ? 'Logrado' : 'Pendiente'})`).join('\n')
    : "No se han detectado deseos conscientes explicitados aún.";

  const systemInstruction = `
    Sos un psicoanalista clínico de Buenos Aires con vasta experiencia. Tu tarea es analizar el discurso del analizante.
    
    ESTILO DE LENGUAJE:
    - Usá exclusivamente el voseo profesional rioplatense (ej: "fijate", "tenés", "podés", "noté que solés").
    - Mantené un tono agudo, profundo y analítico, pero con la calidez de un espacio terapéutico.
    
    ESTRUCTURA DE DEVOLUCIÓN:
    1. ANALIZÁ el inconsciente, nudos sintomáticos y la relación con estos deseos: ${goalsText}.
    2. DEFINÍ una "Hoja de Ruta" (pautas): Brindá pasos concretos, tips accionables o ejercicios de reflexión para que el analizante pueda movilizar su deseo o resolver sus conflictos actuales.
    3. SUGERÍ recursos culturales (libros, videos, etc.) verificados con links reales.
    
    COMPLETITUD DEL TEXTO:
    - Asegurate de que los textos en 'resumen', 'evolucion' y 'pautas' estén COMPLETOS y terminen con punto final.
    
    ESTRUCTURA JSON REQUERIDA:
    - "resumen": Síntesis del clima pulsional.
    - "evolucion": Análisis profundo de recurrencias.
    - "puntosEmocionales": Score por fecha.
    - "pautas": Array de strings con pasos a seguir o tips específicos (mínimo 3).
    - "sugerencias": Array de objetos con links verificados.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [{ parts }],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resumen: { type: Type.STRING },
          evolucion: { type: Type.STRING },
          puntosEmocionales: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fecha: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["fecha", "score"]
            }
          },
          pautas: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Pasos accionables o tips para el crecimiento personal."
          },
          sugerencias: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                titulo: { type: Type.STRING },
                tipo: { type: Type.STRING, enum: ["libro", "articulo", "video", "mindfulness", "gratitud", "inspiracion"] },
                descripcion: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["titulo", "tipo", "descripcion"]
            }
          }
        },
        required: ["resumen", "evolucion", "puntosEmocionales", "pautas", "sugerencias"]
      },
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 12000 }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("La sesión analítica no pudo completarse.");
  
  try {
    const parsed = JSON.parse(resultText);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return { ...parsed, groundingChunks };
  } catch (err) {
    throw new Error("Hubo un error al estructurar la devolución. Por favor, intentá de nuevo.");
  }
};
