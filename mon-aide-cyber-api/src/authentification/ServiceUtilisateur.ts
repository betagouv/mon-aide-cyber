import { EntrepotUtilisateur } from './Utilisateur';

type Token = {
  identifiant: string;
};

type ModificationMotDePasse = {
  motDePasse: string;
  confirmationMotDePasse: string;
  token: Token;
};

export class ServiceUtilisateur {
  constructor(private readonly entrepotUtilisateur: EntrepotUtilisateur) {}

  modifieMotDePasse(
    modificationMotDePasse: ModificationMotDePasse
  ): Promise<void> {
    return this.entrepotUtilisateur
      .lis(modificationMotDePasse.token.identifiant)
      .then((utilisateur) => {
        utilisateur.motDePasse = modificationMotDePasse.motDePasse;
        return this.entrepotUtilisateur.persiste(utilisateur);
      });
  }
}
