export const executeRequete = (
  verbe: "GET" | "POST" | "PATCH",
  chemin: string,
  port: number,
  corps: object | null = null,
): Promise<Response> => {
  const requeteInit: RequestInit = {
    method: verbe,
    headers: { "Content-Type": "application/json" },
  };
  if (corps !== null) {
    requeteInit["body"] = JSON.stringify(corps);
  }
  return fetch(`http://localhost:${port}${chemin}`, requeteInit);
};
