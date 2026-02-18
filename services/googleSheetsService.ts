import { Student } from "../types";

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCDY82cQx2h8HgS-TDlGUvcb_0XzoUQj3YgonbSPffL_AVpVUCPS0dQDLzwWmRjH4apA/exec';

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
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(students),
    });

    if (!response.ok) {
      throw new Error("Error en la red al conectar con Google Sheets");
    }

    return { success: true };
  } catch (error) {
    console.error("Error guardando en Sheets:", error);
    return { success: false, message: String(error) };
  }
};

