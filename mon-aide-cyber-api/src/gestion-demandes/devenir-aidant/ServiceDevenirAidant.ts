import { Departement } from '../departements';
import { EntrepotDemandeDevenirAidant } from './DemandeDevenirAidant';
import crypto from 'crypto';

export type DemandeDTO = {
  identifiant: crypto.UUID;
  date: Date;
  nom: string;
  prenom: string;
  mail: string;
  departement: Departement;
};

export class ServiceDevenirAidant {
  constructor(private readonly entrepot: EntrepotDemandeDevenirAidant) {}

  rechercheParMail(mail: string): Promise<DemandeDTO | undefined> {
    return this.entrepot.rechercheParMail(mail).then((demande) => {
      if (demande) {
        return {
          identifiant: demande.identifiant,
          date: demande.date,
          nom: demande.nom,
          prenom: demande.prenom,
          mail: demande.mail,
          departement: demande.departement,
        };
      }

      return undefined;
    });
  }
}
