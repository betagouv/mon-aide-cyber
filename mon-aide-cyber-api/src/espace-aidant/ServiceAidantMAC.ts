import crypto from 'crypto';
import { Aidant, EntrepotAidant } from './Aidant';
import { AidantDTO, InformationsProfil, ServiceAidant } from './ServiceAidant';
import { FournisseurHorloge } from '../infrastructure/horloge/FournisseurHorloge';
import { AdaptateurEnvoiMail } from '../adaptateurs/AdaptateurEnvoiMail';
import { adaptateurCorpsMessage } from './adaptateurCorpsMessage';
import { fabriqueAnnuaireCOT } from '../infrastructure/adaptateurs/fabriqueAnnuaireCOT';
import { Departement } from '../gestion-demandes/departements';
import { adaptateurEnvironnement } from '../adaptateurs/adaptateurEnvironnement';

class ServiceAidantMAC implements ServiceAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async rechercheParMail(mailAidant: string): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .rechercheParEmail(mailAidant)
      .then((aidant) => this.mappeAidant(aidant))
      .catch(() => undefined);
  }

  async parIdentifiant(
    identifiant: crypto.UUID
  ): Promise<AidantDTO | undefined> {
    return this.entrepotAidant
      .lis(identifiant)
      .then((aidant) => this.mappeAidant(aidant))
      .catch(() => undefined);
  }

  valideLesCGU(identifiantAidant: crypto.UUID): Promise<void> {
    return this.entrepotAidant.lis(identifiantAidant).then(async (aidant) => {
      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      return await this.entrepotAidant.persiste(aidant);
    });
  }

  valideProfilAidant(
    identifiantAidant: crypto.UUID,
    informationsProfil: InformationsProfil,
    adaptateurEnvoiMail: AdaptateurEnvoiMail,
    annuaireCOT: () => {
      rechercheEmailParDepartement: (departement: Departement) => string;
    } = fabriqueAnnuaireCOT().annuaireCOT
  ): Promise<void> {
    return this.entrepotAidant.lis(identifiantAidant).then(async (aidant) => {
      aidant.dateSignatureCGU = FournisseurHorloge.maintenant();
      aidant.dateSignatureCharte = FournisseurHorloge.maintenant();
      aidant.entite = informationsProfil.entite;
      return this.entrepotAidant.persiste(aidant).then(() => {
        if (
          aidant.entite?.type === 'Association' &&
          !aidant.entite.nom &&
          !aidant.entite.siret
        ) {
          const destinataireEnCopie =
            !!aidant.preferences.departements &&
            aidant.preferences.departements.length > 0
              ? annuaireCOT().rechercheEmailParDepartement(
                  aidant.preferences.departements[0]
                )
              : adaptateurEnvironnement.messagerie().emailMAC();

          return adaptateurEnvoiMail.envoie({
            objet:
              'MonAideCyber - Votre inscription au dispositif est confirmée',
            corps: adaptateurCorpsMessage
              .confirmationProfilAidantSansAssociation()
              .genereCorpsMessage(aidant),
            destinataire: { email: aidant.email },
            copie: destinataireEnCopie,
          });
        }
        return;
      });
    });
  }

  private formateLeNom(nomPrenom: string): string {
    const [prenom, nom] = nomPrenom.split(' ');
    return `${prenom} ${nom ? `${nom[0]}.` : ''}`.trim();
  }

  private mappeAidant(aidant: Aidant): AidantDTO {
    return {
      identifiant: aidant.identifiant,
      email: aidant.email,
      nomUsage: this.formateLeNom(aidant.nomPrenom),
      nomComplet: aidant.nomPrenom,
      ...(aidant.siret && { siret: aidant.siret }),
      ...(aidant.dateSignatureCGU && {
        dateSignatureCGU: aidant.dateSignatureCGU,
      }),
    };
  }
}

export const unServiceAidant = (
  entrepotAidant: EntrepotAidant
): ServiceAidant => new ServiceAidantMAC(entrepotAidant);
