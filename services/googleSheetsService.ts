import { Student } from "../types";

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxy23OBwu8zl3qBkyF8_Kqjsr8S6TnfDnfaKHWKk8BswBLUGyeDiZIT9WOGmoPIOPL-Bg/exec';

interface SaveResult {
  success: boolean;
  message?: string;
}

interface LoadResult {
  success: boolean;
  data?: Student[];
  message?: string;
}

export const saveStudentsToSheet = async (students: Student[]): Promise<SaveResult> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Falta configurar la URL del Script de Google");
    return { success: false, message: "URL de Google Apps Script no configurada" };
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(students),
    });

    return { success: true };
  } catch (error) {
    console.error("Error guardando en Sheets:", error);
    return { success: false, message: String(error) };
  }
};

export const fetchStudentsFromSheet = async (): Promise<LoadResult> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Falta configurar la URL del Script de Google");
    return { success: false, message: "URL de Google Apps Script no configurada" };
  }

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?mode=read`);
    if (!response.ok) {
      throw new Error("Error en la red al leer Google Sheets");
    }
    const data = await response.json() as Student[];
    return { success: true, data };
  } catch (error) {
    console.error("Error leyendo desde Sheets:", error);
    return { success: false, message: String(error) };
  }
};
