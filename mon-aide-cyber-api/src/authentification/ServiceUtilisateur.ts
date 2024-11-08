import { EntrepotUtilisateur } from './Utilisateur';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { differenceInMinutes } from 'date-fns';
import { ErreurMAC } from '../domaine/erreurMAC';
import { sommeDeControle } from './sommeDeControle';

type Token = {
  identifiant: string;
  date: Date;
  sommeDeControle: string;
};

type ModificationMotDePasse = {
  motDePasse: string;
  confirmationMotDePasse: string;
  token: Token;
};

export class ErreurReinitialisationMotDePasse extends Error {}

const VINGT_MINUTES = 20;

export class ServiceUtilisateur {
  constructor(private readonly entrepotUtilisateur: EntrepotUtilisateur) {}

  modifieMotDePasse(
    modificationMotDePasse: ModificationMotDePasse
  ): Promise<void> {
    const lapsDeTemps = differenceInMinutes(
      FournisseurHorloge.maintenant(),
      modificationMotDePasse.token.date
    );
    if (isNaN(lapsDeTemps) || lapsDeTemps > VINGT_MINUTES) {
      return this.rejette();
    }
    return this.entrepotUtilisateur
      .lis(modificationMotDePasse.token.identifiant)
      .then((utilisateur) => {
        if (
          sommeDeControle(utilisateur.motDePasse) !==
          modificationMotDePasse.token.sommeDeControle
        ) {
          return this.rejette();
        }
        utilisateur.motDePasse = modificationMotDePasse.motDePasse;
        return this.entrepotUtilisateur.persiste(utilisateur);
      });
  }

  private rejette() {
    return Promise.reject(
      ErreurMAC.cree(
        'Réinitialisation mot de passe',
        new ErreurReinitialisationMotDePasse(
          'Le lien de réinitialisation du mot de passe n’est plus valide.'
        )
      )
    );
  }
}
