
import { GoogleGenAI } from "@google/genai";
import { Student, Subject } from "../types";

export const getAIInsights = async (student: Student, subjects: Subject[]) => {
  const apiKey = (process.env.GEMINI_API_KEY as string) || (process.env.API_KEY as string);
  if (!apiKey) {
    return "Mentor IA no está configurado. Pide al docente que defina la GEMINI_API_KEY antes de usar esta función.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const gradesList = subjects.map(s => `${s.name}: ${student.grades[s.id] || 0.0}`).join(', ');
  
  const prompt = `
    Eres un experto mentor en metodología BIM de "Ascend".
    Analiza las notas del estudiante ${student.name} (Proyecto: ${student.project}).
    Las calificaciones están en una escala de 0.0 a 5.0 (siendo 3.0 la nota mínima de aprobación).
    
    Calificaciones por entrega: ${gradesList}
    
    Genera un análisis constructivo:
    1. Si hay una tendencia al alza entre Parcial 1 y la Entrega Final, felicita el progreso.
    2. Si las notas son bajas (< 3.5), da consejos técnicos de optimización de modelos.
    3. Menciona algo específico sobre la calidad que se espera en un proyecto como "${student.project}".
    4. Cierra con la frase: "Dream it, we BIM it".
    
    Máximo 150 palabras.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error AI:", error);
    return "No pudimos generar el análisis técnico. Revisa la conexión.";
  }
};

export const getClassReport = async (students: Student[], subjects: Subject[]) => {
  const apiKey = (process.env.GEMINI_API_KEY as string) || (process.env.API_KEY as string);
  if (!apiKey) {
    return "Mentor IA no está configurado. Pide al docente que defina la GEMINI_API_KEY antes de usar esta función.";
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const dataSummary = students.map(st => {
    const grades = subjects.map(s => `${s.name}: ${st.grades[s.id] || 0.0}`).join(', ');
    return `${st.name} (Proyecto: ${st.project}): [${grades}]`;
  }).join('\n');

  const prompt = `
    Como Director Académico de Ascend, evalúa el progreso del grupo en escala 0.0-5.0.
    ${dataSummary}
    
    Identifica:
    - El promedio general del salón.
    - Cuál de las tres entregas fue la más difícil para el grupo.
    - Recomendaciones para la siguiente cohorte basadas en estos resultados.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Error al procesar el reporte grupal.";
  }
};
