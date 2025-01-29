import {
  EntrepotUtilisateurInscrit,
  ServiceUtilisateurInscrit,
} from './UtilisateurInscrit';
import crypto from 'crypto';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

class ServiceUtilisateurInscritMAC implements ServiceUtilisateurInscrit {
  constructor(
    private readonly entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit
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

  valideProfil(identifiantUtilisateurInscrit: crypto.UUID): Promise<void> {
    return this.entrepotUtilisateurInscrit
      .lis(identifiantUtilisateurInscrit)
      .then(async (utilisateurInscrit) => {
        utilisateurInscrit.dateSignatureCGU = FournisseurHorloge.maintenant();
        return await this.entrepotUtilisateurInscrit.persiste(
          utilisateurInscrit
        );
      });
  }
}

export const unServiceUtilisateurInscrit = (
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit
): ServiceUtilisateurInscrit =>
  new ServiceUtilisateurInscritMAC(entrepotUtilisateurInscrit);
