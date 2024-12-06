import { Entrepot } from '../domaine/Entrepot';
import { UUID } from 'crypto';
import { Departement } from '../gestion-demandes/departements';
import { CriteresDeRecherche } from './ServiceAnnuaireAidants';

export type Aidant = {
  nomPrenom: string;
  identifiant: UUID;
  departements: Departement[];
};

export interface EntrepotAnnuaireAidants extends Entrepot<Aidant> {
  rechercheParCriteres(
    criteresDeRecherche?: CriteresDeRecherche
  ): Promise<Aidant[]>;
}
