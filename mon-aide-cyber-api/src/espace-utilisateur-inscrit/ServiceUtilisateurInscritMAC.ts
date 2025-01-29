import {
  EntrepotUtilisateurInscrit,
  ServiceUtilisateurInscrit,
  UtilisateurInscrit,
} from './UtilisateurInscrit';
import crypto from 'crypto';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ServiceAidant } from '../espace-aidant/ServiceAidant';

export class ErreurAidantNonTrouve extends Error {
  constructor() {
    super('Aidant non trouvé.');
  }
}

class ServiceUtilisateurInscritMAC implements ServiceUtilisateurInscrit {
  constructor(
    private readonly entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
    private readonly serviceAidant: ServiceAidant
  ) {}
  valideLesCGU(identifiantUtilisateur: crypto.UUID): Promise<void> {
    return this.entrepotUtilisateurInscrit
      .lis(identifiantUtilisateur)
      .then(async (utilisateurInscrit) => {
        utilisateurInscrit.dateSignatureCGU = FournisseurHorloge.maintenant();
        return await this.entrepotUtilisateurInscrit.persiste(
          utilisateurInscrit
        );
      });
  }

  valideProfil(identifiantAidant: crypto.UUID): Promise<void> {
    return this.serviceAidant
      .parIdentifiant(identifiantAidant)
      .then((aidant) => {
        if (!aidant) {
          throw new ErreurAidantNonTrouve();
        }
        const utilisateur: UtilisateurInscrit = {
          identifiant: aidant.identifiant,
          email: aidant.email,
          nomPrenom: aidant.nomComplet,
          dateSignatureCGU: FournisseurHorloge.maintenant(),
        };
        this.entrepotUtilisateurInscrit.persiste(utilisateur);
      });
  }
}

export const unServiceUtilisateurInscrit = (
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
  serviceAidant: ServiceAidant
): ServiceUtilisateurInscrit =>
  new ServiceUtilisateurInscritMAC(entrepotUtilisateurInscrit, serviceAidant);
