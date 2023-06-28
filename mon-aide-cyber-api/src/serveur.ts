import * as path from "path";
import express, { Request, Response } from "express";
import * as http from "http";
import rateLimit from "express-rate-limit";

const creeServeur = () => {
  let serveur: http.Server;

  const app = express();

  const limiteurTrafficUI = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message:
      "Vous avez atteint le nombre maximal de requête. Veuillez réessayer ultérieurement.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: (request: Request, _response: Response) =>
      request.path.startsWith("/api"),
  });
  app.use(limiteurTrafficUI);
  app.use(
    express.static(path.join(__dirname, "./../../mon-aide-cyber-ui/dist")),
  );
  const ecoute = (port: number, succes: () => void) => {
    serveur = app.listen(port, succes);
  };
  const arreteEcoute = () => {
    serveur.close();
  };

  app.get("/api/hello", (_req: Request, res: Response) => {
    res.send("OK");
  });
  app.get("*", function (_req: Request, res: Response) {
    res.sendFile(
      path.join(__dirname, "./../../mon-aide-cyber-ui/dist/index.html"),
    );
  });

  return { ecoute, arreteEcoute };
};

export default { creeServeur };
