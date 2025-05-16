import { AdaptateurEnvoiMail } from '../../adaptateurs/AdaptateurEnvoiMail';
import { Departement } from '../departements';
import {
  DonneesMiseEnRelation,
  envoieAuCOTAucunAidantPourLaDemandeAide,
  envoieConfirmationDemandeAide,
  envoieRecapitulatifDemandeAide,
  MiseEnRelation,
  ParCriteres,
  ResultatMiseEnRelation,
} from './miseEnRelation';
import { Entrepots } from '../../domaine/Entrepots';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Aidant } from '../../espace-aidant/Aidant';
import crypto from 'crypto';
import { DemandeAide } from './DemandeAide';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';
import { ServiceDeChiffrement } from '../../securite/ServiceDeChiffrement';

export type AidantMisEnRelation = {
  email: string;
  nomPrenom: string;
  lienPourPostuler: string;
};

export type TonkenAttributionDemandeAide = {
  demande: crypto.UUID;
  aidant: crypto.UUID;
};
export const tokenAttributionDemandeAide = (
  serviceDeChiffrement: ServiceDeChiffrement = adaptateurServiceChiffrement()
): {
  dechiffre: (token: string) => TonkenAttributionDemandeAide;
  chiffre: (emailEntiteAidee: string, identifiantAidant: crypto.UUID) => string;
} => {
  return {
    chiffre(emailEntiteAidee: string, identifiantAidant: crypto.UUID): string {
      return btoa(
        serviceDeChiffrement.chiffre(
          JSON.stringify({
            demande: emailEntiteAidee,
            aidant: identifiantAidant,
          })
        )
      );
    },
    dechiffre(token: string): TonkenAttributionDemandeAide {
      return JSON.parse(serviceDeChiffrement.dechiffre(atob(token)));
    },
  };
};

export class MiseEnRelationParCriteres implements MiseEnRelation {
  constructor(
    private readonly adaptateurEnvoiMail: AdaptateurEnvoiMail,
    private readonly annuaireCOT: {
      rechercheEmailParDepartement: (departement: Departement) => string;
    },
    private readonly entrepots: Entrepots
  ) {}

  async execute(
    donneesMiseEnRelation: DonneesMiseEnRelation
  ): Promise<ResultatMiseEnRelation<ParCriteres>> {
    const aidants = await this.entrepots.aidants().rechercheParPreferences({
      departement: donneesMiseEnRelation.demandeAide.departement,
      secteursActivite: donneesMiseEnRelation.secteursActivite,
      typeEntite: donneesMiseEnRelation.typeEntite,
    });
    const aucunAidantMatche = aidants.length === 0;
    if (aucunAidantMatche) {
      await envoieAuCOTAucunAidantPourLaDemandeAide(
        this.adaptateurEnvoiMail,
        donneesMiseEnRelation,
        this.annuaireCOT
      );
    } else {
      await this.informeAidantsDeLaDemandeAide(aidants, donneesMiseEnRelation);
    }
    await envoieConfirmationDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      undefined
    );
    return {
      type: 'PAR_CRITERES',
      resultat: {
        nombreAidants: aidants.length,
        typeEntite: donneesMiseEnRelation.typeEntite.nom,
        secteursActivite: donneesMiseEnRelation.secteursActivite.map(
          (s) => s.nom
        ),
        departement: donneesMiseEnRelation.demandeAide.departement.code,
      },
    };
  }

  private async informeAidantsDeLaDemandeAide(
    aidants: Aidant[],
    donneesMiseEnRelation: DonneesMiseEnRelation
  ) {
    await envoieRecapitulatifDemandeAide(
      this.adaptateurEnvoiMail,
      donneesMiseEnRelation.demandeAide,
      aidants,
      this.annuaireCOT
    );

    const matchingAidants = this.aidantsPourPostuler(
      donneesMiseEnRelation.demandeAide,
      adaptateurEnvironnement.miseEnRelation().aidantsDeTest
    );
    const envoisEmails = matchingAidants.map((a) =>
      this.adaptateurEnvoiMail.envoieMiseEnRelation(donneesMiseEnRelation, a)
    );
    await Promise.all(envoisEmails);
  }

  private aidantsPourPostuler = (
    demandeAide: DemandeAide,
    emailsDesAidants: string[]
  ): AidantMisEnRelation[] => {
    const urlMAC = adaptateurEnvironnement.mac().urlMAC();
    const { chiffre } = tokenAttributionDemandeAide();

    return emailsDesAidants.map((email) => ({
      email,
      nomPrenom: 'Un prénom',
      lienPourPostuler: `${urlMAC}/repondre-a-une-demande?token=${chiffre(demandeAide.email, crypto.randomUUID())}`,
    }));
  };
}
