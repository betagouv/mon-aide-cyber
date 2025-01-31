import {
  EntrepotUtilisateurInscrit,
  ServiceUtilisateurInscrit,
  UtilisateurInscrit,
} from './UtilisateurInscrit';
import crypto from 'crypto';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { ServiceAidant } from '../espace-aidant/ServiceAidant';
import { AdaptateurRelations } from '../relation/AdaptateurRelations';
import { unTupleUtilisateurInscritInitieDiagnostic } from '../diagnostic/tuples';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';

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

  valideProfil(
    identifiantUtilisateurInscrit: crypto.UUID,
    adaptateurDeRelations: AdaptateurRelations,
    busEvenement: BusEvenement
  ): Promise<void> {
    return this.serviceAidant
      .parIdentifiant(identifiantUtilisateurInscrit)
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
        return this.entrepotUtilisateurInscrit
          .persiste(utilisateur)
          .then(() => {
            return adaptateurDeRelations
              .identifiantsObjetsLiesAUtilisateur(utilisateur.identifiant)
              .then((identifiants) => {
                const tuples = identifiants.reduce((precedent, courant) => {
                  precedent.push(
                    adaptateurDeRelations.creeTuple(
                      unTupleUtilisateurInscritInitieDiagnostic(
                        utilisateur.identifiant,
                        courant as crypto.UUID
                      )
                    )
                  );
                  return precedent;
                }, [] as Promise<void>[]);
                return Promise.all(tuples).then(() => Promise.resolve());
              })
              .then(() =>
                busEvenement.publie<AidantMigreEnUtilisateurInscrit>({
                  identifiant: adaptateurUUID.genereUUID(),
                  type: 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT',
                  date: FournisseurHorloge.maintenant(),
                  corps: {
                    identifiantUtilisateur: aidant.identifiant,
                  },
                })
              );
          });
      });
  }
}

export type AidantMigreEnUtilisateurInscrit = Evenement<{
  identifiantUtilisateur: crypto.UUID;
}>;

export const unServiceUtilisateurInscrit = (
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
  serviceAidant: ServiceAidant
): ServiceUtilisateurInscrit =>
  new ServiceUtilisateurInscritMAC(entrepotUtilisateurInscrit, serviceAidant);
