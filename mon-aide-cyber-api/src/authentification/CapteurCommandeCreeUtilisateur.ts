import crypto from 'crypto';
import { CapteurCommande, Commande } from '../domaine/commande';
import { Entrepots } from '../domaine/Entrepots';
import { Utilisateur } from './Utilisateur';
import { adaptateurUUID } from '../infrastructure/adaptateurs/adaptateurUUID';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';

export type CommandeCreeUtilisateur = Commande & {
  type: 'CommandeCreeUtilisateur';
  dateSignatureCGU: Date;
  identifiantConnexion: string;
  motDePasse: string;
  nomPrenom: string;
};
export type UtilisateurCree = {
  identifiant: crypto.UUID;
  email: string;
  nomPrenom: string;
};

export class CapteurCommandeCreeUtilisateur
  implements CapteurCommande<CommandeCreeUtilisateur, UtilisateurCree>
{
  constructor(private readonly entrepots: Entrepots) {}

  execute(commande: CommandeCreeUtilisateur): Promise<UtilisateurCree> {
    const utilisateur: Utilisateur = {
      identifiant: adaptateurUUID.genereUUID(),
      identifiantConnexion: commande.identifiantConnexion,
      nomPrenom: commande.nomPrenom,
      motDePasse: commande.motDePasse,
      dateSignatureCGU: FournisseurHorloge.maintenant(),
    };
    return this.entrepots
      .utilisateurs()
      .persiste(utilisateur)
      .then(() => ({
        identifiant: utilisateur.identifiant,
        email: utilisateur.identifiantConnexion,
        nomPrenom: utilisateur.nomPrenom,
      }));
  }
}
