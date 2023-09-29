import { Express } from "express";
import { inject, Response } from "light-my-request";

export const executeRequete = (
  app: Express,
  verbe: "GET" | "POST" | "PATCH",
  chemin: string,
  port: number,
  corps: object | undefined = undefined,
): Promise<Response> => {
  const requeteInit: RequestInit = {
    method: verbe,
    headers: { "Content-Type": "application/json" },
  };
  if (corps !== null) {
    requeteInit["body"] = JSON.stringify(corps);
  }
  return inject(app, {
    method: verbe,
    url: { pathname: chemin, port },
    ...(corps && { body: corps }),
  }).then((rep) => rep);
};
