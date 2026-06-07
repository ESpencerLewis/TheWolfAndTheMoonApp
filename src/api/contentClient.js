
export async function getEpisodes() {
  const res = await fetch('/content/episodes.json');
  return await res.json();
}
