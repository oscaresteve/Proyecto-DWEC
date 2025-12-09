import { state$ } from "./stateService.js";

const SUPABASE_URL = "https://ypfxbsnqfpdkwzrhmkoa.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZnhic25xZnBka3d6cmhta29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTc0MTgsImV4cCI6MjA3NjA5MzQxOH0.ZhyDd2DzaJTR_2lE7T361rwiubFLG7dV0QiJzu6Ie8w";

export async function getMaxScore() {
  const user = state$.value.user;
  if (!user) return;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/users?email=eq.${user.email}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    const maxScore = data[0]?.max_score ?? 0;
    return maxScore;
  } catch (err) {
    console.error("Error obteniendo max_score:", err);
  }
}

export async function saveGameMove(game) {
  const user = state$.value.user;
  if (!user) return;

  try {
    const maxScore = await getMaxScore();

    const body = { current_game: game };
    if (game.score > maxScore) {
      body.max_score = game.score;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${user.email}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Error guardando el juego:", err);
  }
}
