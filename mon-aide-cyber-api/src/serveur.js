import express from "express";

const creeServeur = () => {
  let serveur;

  const app = express();

  const ecoute = (port, succes) => {
    serveur = app.listen(port, succes);
  };

  const arreteEcoute = () => {
    serveur.close();
  };

  return { ecoute, arreteEcoute };
};

export default { creeServeur };
