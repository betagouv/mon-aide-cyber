import MAC from "./src/serveur.js";

const serveur = MAC.creeServeur();

const port = process.env.PORT || 8081;
serveur.ecoute(port, () => {
  console.log(`MonAideCyber est démarré et écoute le port ${port} !…`);
});
