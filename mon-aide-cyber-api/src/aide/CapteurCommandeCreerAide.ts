import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { Aide } from './Aide';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';
import { Departement } from '../gestion-demandes/departements';

export type CommandeCreerAide = Omit<Commande, 'type'> & {
  type: 'CommandeCreerAide';
  departement: Departement;
  email: string;
  raisonSociale?: string;
};

export class CapteurCommandeCreerAide
  implements CapteurCommande<CommandeCreerAide, Aide>
{
  constructor(private readonly entrepots: Entrepots) {}

  async execute(commande: CommandeCreerAide): Promise<Aide> {
    const aide: Aide = {
      dateSignatureCGU: FournisseurHorloge.maintenant(),
      departement: commande.departement,
      email: commande.email,
      identifiant: adaptateurUUID.genereUUID(),
      ...(commande.raisonSociale && { raisonSociale: commande.raisonSociale }),
    };

    await this.entrepots.aides().persiste(aide);

    return Promise.resolve(aide);
  }
}
