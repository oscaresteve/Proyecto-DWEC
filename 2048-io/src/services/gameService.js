import { state$ } from "./stateService.js";

const SUPABASE_URL = "https://ypfxbsnqfpdkwzrhmkoa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZnhic25xZnBka3d6cmhta29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTc0MTgsImV4cCI6MjA3NjA5MzQxOH0.ZhyDd2DzaJTR_2lE7T361rwiubFLG7dV0QiJzu6Ie8w";

export async function saveGame() {
  const user = state$.value.user;
  if (!user) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${user.email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        nickname: user.nickname,
        max_score: user.max_score,
        game: user.game,
      }),
    });

    console.log("Juego guardado correctamente");
  } catch (err) {
    console.error("Error guardando el juego:", err);
  }
}
