import * as path from "path";
import express, { Request, Response } from "express";
import * as http from "http";

const creeServeur = () => {
  let serveur: http.Server;

  const app = express();

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
