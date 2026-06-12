const API_BASE_URL = "http://localhost:3000/api";

function getUserId(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("random_user_id");
  }
  return null;
}
export async function enviarNota(
  nombreEjercicio: string,
  notaSacada: number,
): Promise<boolean> {
  const userId = getUserId();
  if (!userId) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/grades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        topic: nombreEjercicio,
        score: notaSacada,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("❌ Error al registrar la nota en la API:", error);
    return false;
  }
}
export async function obtenerNotaGlobal() {
  const userId = getUserId();
  if (!userId) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/grades/global/${userId}`);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener el promedio global:", error);
    return null;
  }
}
