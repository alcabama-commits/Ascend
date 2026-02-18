import { Student } from "../types";

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVu0_hhksHZGzbz67sCZG-a8fHGeWNs59bdMTiI7vung43bsBXtF80EDemslFgTJ7VAA/exec';

interface SaveResult {
  success: boolean;
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
      mode: "no-cors", // ADVERTENCIA: 'no-cors' previene leer la respuesta del servidor. La app asume que el guardado fue exitoso.
      body: JSON.stringify(students),
    });

    return { success: true };
  } catch (error) {
    console.error("Error guardando en Sheets:", error);
    return { success: false, message: String(error) };
  }
};

export const getStudentsFromSheet = async (): Promise<Student[]> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("Falta configurar la URL del Script de Google");
    return [];
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);

    if (!response.ok) {
      throw new Error(`Error en la red al obtener datos: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validamos que la respuesta sea un array para evitar errores en la app
    if (!Array.isArray(data)) {
      console.error("La respuesta de Google Sheets no es un array válido:", data);
      return [];
    }

    return data as Student[];
  } catch (error) {
    console.error("Error obteniendo datos de Sheets:", error);
    return []; // Devolver un array vacío en caso de error para no romper la UI
  }
};
