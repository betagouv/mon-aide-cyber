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
import { RepertoireDeContacts } from '../contacts/RepertoireDeContacts';

export class ErreurAidantNonTrouve extends Error {
  constructor() {
    super('Aidant non trouvé.');
  }
}

class ServiceUtilisateurInscritMAC implements ServiceUtilisateurInscrit {
  constructor(
    private readonly entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
    private readonly serviceAidant: ServiceAidant,
    private readonly repertoire: RepertoireDeContacts
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

  async valideProfil(
    identifiantUtilisateurInscrit: crypto.UUID,
    adaptateurDeRelations: AdaptateurRelations,
    busEvenement: BusEvenement
  ): Promise<void> {
    const aidant = await this.serviceAidant.parIdentifiant(
      identifiantUtilisateurInscrit
    );
    if (!aidant) {
      throw new ErreurAidantNonTrouve();
    }

    const utilisateur: UtilisateurInscrit = {
      identifiant: aidant.identifiant,
      email: aidant.email,
      nomPrenom: aidant.nomComplet,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    };
    await this.entrepotUtilisateurInscrit.persiste(utilisateur);

    const identifiants =
      await adaptateurDeRelations.diagnosticsFaitsParUtilisateurMAC(
        utilisateur.identifiant
      );
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
    await Promise.all(tuples);

    await this.repertoire.creeUtilisateurInscrit(utilisateur);

    await busEvenement.publie<AidantMigreEnUtilisateurInscrit>({
      identifiant: adaptateurUUID.genereUUID(),
      type: 'AIDANT_MIGRE_EN_UTILISATEUR_INSCRIT',
      date: FournisseurHorloge.maintenant(),
      corps: {
        identifiantUtilisateur: aidant.identifiant,
      },
    });
  }
}

export type AidantMigreEnUtilisateurInscrit = Evenement<{
  identifiantUtilisateur: crypto.UUID;
}>;

export const unServiceUtilisateurInscrit = (
  entrepotUtilisateurInscrit: EntrepotUtilisateurInscrit,
  serviceAidant: ServiceAidant,
  repertoire: RepertoireDeContacts
): ServiceUtilisateurInscrit =>
  new ServiceUtilisateurInscritMAC(
    entrepotUtilisateurInscrit,
    serviceAidant,
    repertoire
  );
