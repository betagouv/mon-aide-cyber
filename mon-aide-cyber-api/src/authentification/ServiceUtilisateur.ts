import { EntrepotUtilisateur } from './Utilisateur';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { differenceInMinutes } from 'date-fns';
import { ErreurMAC } from '../domaine/erreurMAC';
import { sommeDeControle } from './sommeDeControle';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import crypto, { UUID } from 'crypto';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';

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
  constructor(
    private readonly entrepotUtilisateur: EntrepotUtilisateur,
    private readonly busEvenement: BusEvenement
  ) {}

  modifieMotDePasse(
    modificationMotDePasse: ModificationMotDePasse
  ): Promise<void> {
    const lapsDeTemps = differenceInMinutes(
      FournisseurHorloge.maintenant(),
      modificationMotDePasse.token.date
    );
    if (isNaN(lapsDeTemps) || lapsDeTemps > VINGT_MINUTES) {
      return this.rejette(
        modificationMotDePasse.token.identifiant,
        'DATE_ECHUE'
      );
    }
    return this.entrepotUtilisateur
      .lis(modificationMotDePasse.token.identifiant)
      .then((utilisateur) => {
        if (
          sommeDeControle(utilisateur.motDePasse) !==
          modificationMotDePasse.token.sommeDeControle
        ) {
          return this.rejette(
            modificationMotDePasse.token.identifiant,
            'REINITIALISATION_DEJA_FAITE'
          );
        }
        utilisateur.motDePasse = modificationMotDePasse.motDePasse;
        return this.entrepotUtilisateur.persiste(utilisateur);
      })
      .then(() =>
        this.busEvenement.publie<ReinitialisationMotDePasseFaite>({
          identifiant: adaptateurUUID.genereUUID(),
          type: 'REINITIALISATION_MOT_DE_PASSE_FAITE',
          date: FournisseurHorloge.maintenant(),
          corps: {
            identifiant: modificationMotDePasse.token.identifiant as UUID,
          },
        })
      );
  }

  private rejette(
    identifiant: string,
    raison: 'DATE_ECHUE' | 'REINITIALISATION_DEJA_FAITE'
  ) {
    return this.busEvenement
      .publie<ReinitialisationMotDePasseErronee>({
        identifiant: adaptateurUUID.genereUUID(),
        type: 'REINITIALISATION_MOT_DE_PASSE_ERRONEE',
        date: FournisseurHorloge.maintenant(),
        corps: {
          identifiant: identifiant as UUID,
          raison,
        },
      })
      .then(() =>
        Promise.reject(
          ErreurMAC.cree(
            'Réinitialisation mot de passe',
            new ErreurReinitialisationMotDePasse(
              'Le lien de réinitialisation du mot de passe n’est plus valide.'
            )
          )
        )
      );
  }
}

export type ReinitialisationMotDePasseFaite = Evenement<{
  identifiant: crypto.UUID;
}>;

export type ReinitialisationMotDePasseErronee = Evenement<{
  identifiant: crypto.UUID;
  raison: 'DATE_ECHUE' | 'REINITIALISATION_DEJA_FAITE';
}>;
