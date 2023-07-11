export const executeRequete = (
  verbe: "GET" | "POST",
  chemin: string,
  port: number,
): Promise<Response> => {
  return fetch(`http://localhost:${port}${chemin}`, { method: verbe });
};
