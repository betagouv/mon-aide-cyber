import { BusCommande, CapteurSaga, Saga } from '../../domaine/commande';
import crypto from 'crypto';
import { Entrepots } from '../../domaine/Entrepots';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';
import { DemandeDevenirAidant, StatutDemande } from './DemandeDevenirAidant';
import {
  CommandeCreeEspaceAidant,
  EspaceAidantCree,
} from '../../espace-aidant/CapteurCommandeCreeEspaceAidant';
import { ErreurCreationEspaceAidant } from '../../espace-aidant/Aidant';
import { estDateNouveauParcoursDemandeDevenirAidant } from './nouveauParcours';

export type SagaDemandeAidantCreeEspaceAidant = Omit<Saga, 'type'> & {
  type: 'SagaDemandeAidantEspaceAidant';
  idDemande: crypto.UUID;
};

export class CapteurSagaDemandeAidantCreeEspaceAidant
  implements CapteurSaga<SagaDemandeAidantCreeEspaceAidant, void>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busCommande: BusCommande,
    private readonly busEvenement: BusEvenement
  ) {}

  async execute(saga: SagaDemandeAidantCreeEspaceAidant): Promise<void> {
    return this.entrepots
      .demandesDevenirAidant()
      .lis(saga.idDemande)
      .then(async (demande) => {
        const nomPrenom = `${demande.prenom} ${demande.nom}`;
        return this.busCommande
          .publie<CommandeCreeEspaceAidant, EspaceAidantCree>({
            identifiant: adaptateurUUID.genereUUID(),
            dateSignatureCGU: estDateNouveauParcoursDemandeDevenirAidant()
              ? demande.date
              : FournisseurHorloge.maintenant(),
            email: demande.mail,
            nomPrenom: nomPrenom,
            type: 'CommandeCreeEspaceAidant',
            departement: demande.departement,
            dateSignatureCharte: demande.date,
            ...this.entiteAidant(demande),
          })
          .then((compte) => {
            return this.entrepots
              .demandesDevenirAidant()
              .persiste({ ...demande, statut: StatutDemande.TRAITEE })
              .then(() =>
                this.busEvenement
                  .publie<DemandeDevenirAidantEspaceAidantCree>({
                    type: 'DEMANDE_DEVENIR_AIDANT_ESPACE_AIDANT_CREE',
                    date: FournisseurHorloge.maintenant(),
                    identifiant: adaptateurUUID.genereUUID(),
                    corps: {
                      idAidant: compte.identifiant,
                      idDemande: demande.identifiant,
                    },
                  })
                  .then(() => Promise.resolve())
              );
          });
      });
  }

  private entiteAidant(demande: DemandeDevenirAidant) {
    const entiteNonValide =
      demande.entite &&
      demande.entite.type !== 'Association' &&
      (!demande.entite.nom ||
        !demande.entite.siret ||
        demande.entite.nom.trim() === '' ||
        demande.entite.siret.trim() === '');
    if (!demande.entite || entiteNonValide) {
      throw new ErreurCreationEspaceAidant(
        "Les informations de l'entité de l'Aidant doivent être fournies"
      );
    }
    return {
      ...(demande.entite && { entite: { ...demande.entite } }),
    };
  }
}

export type DemandeDevenirAidantEspaceAidantCree = Evenement<{
  idDemande: crypto.UUID;
  idAidant: crypto.UUID;
}>;
