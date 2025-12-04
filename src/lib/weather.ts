export async function getWeather({ lat, lng }: { lat: number; lng: number }) {
  const key = process.env.OPENWEATHER_API_KEY!;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${key}`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json();
  return {
    tempC: j.main?.temp as number | undefined,
    desc: j.weather?.[0]?.description as string | undefined,
  };
}
