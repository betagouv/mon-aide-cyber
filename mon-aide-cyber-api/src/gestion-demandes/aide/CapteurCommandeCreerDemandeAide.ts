import { CapteurCommande, Commande } from '../../domaine/commande';
import { Departement } from '../departements';
import { DemandeAide } from './DemandeAide';
import { Entrepots } from '../../domaine/Entrepots';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { adaptateurUUID } from '../../infrastructure/adaptateurs/adaptateurUUID';

export type CommandeCreerDemandeAide = Omit<Commande, 'type'> & {
  type: 'CommandeCreerDemandeAide';
  departement: Departement;
  email: string;
  raisonSociale?: string;
};

export class CapteurCommandeCreerDemandeAide
  implements CapteurCommande<CommandeCreerDemandeAide, DemandeAide>
{
  constructor(private readonly entrepots: Entrepots) {}

  async execute(commande: CommandeCreerDemandeAide): Promise<DemandeAide> {
    const aide: DemandeAide = {
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      departement: commande.departement,
      email: commande.email,
      identifiant: adaptateurUUID.genereUUID(),
      ...(commande.raisonSociale && { raisonSociale: commande.raisonSociale }),
    };

    await this.entrepots.demandesAides().persiste(aide);

    return Promise.resolve(aide);
  }
}
