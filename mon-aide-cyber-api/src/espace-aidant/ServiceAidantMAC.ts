import crypto from 'crypto';
import { Aidant, EntrepotAidant } from './Aidant';
import { AidantDTO, ServiceAidant } from './ServiceAidant';
import { DonneesAidant } from '../administration/aidant/creeAidant';

class ServiceAidantMAC implements ServiceAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .rechercheParEmail(mailAidant)
      .then((aidant) => ({
        identifiant: aidant.identifiant,
        email: aidant.email,
        nomUsage: this.formateLeNom(aidant.nomPrenom),
      }))
      .catch(() => undefined);
  }

  async parIdentifiant(
    identifiant: crypto.UUID
  ): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .lis(identifiant)
      .then((aidant) => ({
        identifiant: aidant.identifiant,
        email: aidant.email,
        nomUsage: this.formateLeNom(aidant.nomPrenom),
      }))
      .catch(() => undefined);
  }

  private formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
  }

  creeAidant(donneesAidant: DonneesAidant): Promise<AidantDTO | undefined> {
    // Dans l'idée...
    // on recherche par mail si l'aidant existe
    // Si oui : on ne fait rien
    // Si non, on le persiste + publie un événement

    return this.rechercheParMail(donneesAidant.identifiantConnexion)
      .then(async (aidantTrouve: AidantDTO | undefined) => {
        if (aidantTrouve) {
          return undefined;
        }
        const aidant: Aidant = {
          identifiant: crypto.randomUUID(),
          email: donneesAidant.identifiantConnexion,
          // motDePasse: donneesAidant.motDePasse,
          nomPrenom: donneesAidant.nomPrenom,
          preferences: {
            secteursActivite: [],
            departements: [],
            typesEntites: [],
          },
          consentementAnnuaire: false,
        };
        await this.entrepotAidant.persiste(aidant);
        /* await busEvenement.publie<AidantCree>({ // nouvel événement à créer
          date: FournisseurHorloge.maintenant(),
          identifiant: aidant.identifiant,
          type: 'AIDANT_CREE',
          corps: { identifiant: aidant.identifiant },
        });*/
        return {
          identifiant: aidant.identifiant,
          email: aidant.email,
          nomUsage: this.formateLeNom(aidant.nomPrenom),
        };
      })
      .catch(async () => undefined);
  }
}

export const unServiceAidant = (
  entrepotAidant: EntrepotAidant
): ServiceAidant => new ServiceAidantMAC(entrepotAidant);
