import { CapteurCommande, Commande } from '../../domaine/commande';
import crypto from 'crypto';
import { Departement } from '../departements';
import { EntrepotDemandeAide } from './DemandeAide';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export type CommandeMettreAJourDemandeAide = Commande & {
  identifiant: crypto.UUID;
  departement: Departement;
  email: string;
  raisonSociale?: string;
};

export class CapteurCommandeMettreAJourDemandeAide
  implements CapteurCommande<CommandeMettreAJourDemandeAide, void>
{
  constructor(private readonly entrepotDemandeAide: EntrepotDemandeAide) {}

  execute(commande: CommandeMettreAJourDemandeAide): Promise<void> {
    return this.entrepotDemandeAide.persiste({
      identifiant: commande.identifiant,
      email: commande.email,
      departement: commande.departement,
      ...(commande.raisonSociale && { raisonSociale: commande.raisonSociale }),
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    });
  }
}
