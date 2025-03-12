import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { BusEvenement, Evenement } from '../domaine/BusEvenement';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import crypto from 'crypto';
import { AggregatNonTrouve } from '../domaine/Aggregat';
import { Departement } from '../gestion-demandes/departements';
import {
  Aidant,
  ErreurCreationEspaceAidant,
  estSiretGendarmerie,
  formatteLeNomPrenomSelonRegleAffichage,
  Siret,
  TypeAffichageAnnuaire,
} from './Aidant';

export type TypeEntite = 'ServicePublic' | 'ServiceEtat' | 'Association';

type Entite = {
  nom?: string;
  siret?: string;
  type: TypeEntite;
};

export type CommandeCreeEspaceAidant = Omit<Commande, 'type'> & {
  type: 'CommandeCreeEspaceAidant';
  dateSignatureCGU: Date;
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
  departement: Departement;
  siret?: Siret;
  dateSignatureCharte?: Date;
  entite?: Entite;
};

export type EspaceAidantCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export type AidantCree = Evenement<{
  identifiant: crypto.UUID;
  departement?: string;
  typeAidant: 'Gendarme' | 'Aidant';
}>;

export class CapteurCommandeCreeEspaceAidant
  implements CapteurCommande<CommandeCreeEspaceAidant, EspaceAidantCree>
{
  constructor(
    private readonly entrepots: Entrepots,
    private readonly busEvenement: BusEvenement
  ) {}

  async execute(commande: CommandeCreeEspaceAidant): Promise<EspaceAidantCree> {
    try {
      await this.entrepots.aidants().rechercheParEmail(commande.email);
      throw new ErreurCreationEspaceAidant(
        'Un compte Aidant avec cette adresse email existe déjà.'
      );
    } catch (erreur) {
      if (!(erreur instanceof AggregatNonTrouve)) throw erreur;

      const aidant: Aidant = {
        identifiant: commande.identifiant,
        email: commande.email,
        nomPrenom: commande.nomPrenom,
        preferences: {
          departements: [commande.departement],
          secteursActivite: [],
          typesEntites: [],
          nomAffichageAnnuaire: formatteLeNomPrenomSelonRegleAffichage(
            commande.nomPrenom,
            TypeAffichageAnnuaire.PRENOM_N
          ),
        },
        consentementAnnuaire: false,
        ...(commande.siret && { siret: commande.siret }),
        dateSignatureCGU: commande.dateSignatureCGU,
        ...(commande.dateSignatureCharte && {
          dateSignatureCharte: commande.dateSignatureCharte,
        }),
        ...(commande.entite && {
          entite: {
            ...(commande.entite.nom && { nom: commande.entite.nom }),
            ...(commande.entite.siret && { siret: commande.entite.siret }),
            type: commande.entite.type,
          },
        }),
      };

      await this.entrepots.aidants().persiste(aidant);
      await this.busEvenement.publie<AidantCree>({
        corps: {
          identifiant: aidant.identifiant,
          departement: commande.departement.code,
          typeAidant: estSiretGendarmerie(aidant.siret) ? 'Gendarme' : 'Aidant',
        },
        date: FournisseurHorloge.maintenant(),
        identifiant: aidant.identifiant,
        type: 'AIDANT_CREE',
      });

      return {
        identifiant: aidant.identifiant,
        email: aidant.email,
        nomPrenom: aidant.nomPrenom,
      };
    }
  }
}
