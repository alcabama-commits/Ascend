import { Student } from "../types";

// REEMPLAZA ESTA URL CON LA QUE OBTUVISTE EN EL PASO DE APPS SCRIPT
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCDY82cQx2h8HgS-TDlGUvcb_0XzoUQj3YgonbSPffL_AVpVUCPS0dQDLzwWmRjH4apA/exec';

export const saveStudentsToSheet = async (students: Student[]) => {
  if (GOOGLE_SCRIPT_URL === 'https://script.google.com/macros/s/AKfycbxCDY82cQx2h8HgS-TDlGUvcb_0XzoUQj3YgonbSPffL_AVpVUCPS0dQDLzwWmRjH4apA/exec') {
    console.error("Falta configurar la URL del Script de Google");
    return { success: false, message: "URL no configurada" };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(students),
      // mode: 'no-cors' es necesario a veces con Apps Script si no se maneja bien el redirect,
      // pero intentaremos standard primero. Si falla, usa 'no-cors'.
    });

    if (!response.ok) {
      throw new Error('Error en la red al conectar con Google Sheets');
    }

    return { success: true };
  } catch (error) {
    console.error("Error guardando en Sheets:", error);
    return { success: false, message: String(error) };
  }
};