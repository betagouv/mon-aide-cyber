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
import { tokenAttributionDemandeAide } from '../../api/aidant/tokenAttributionDemandeAide';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { Aidant } from '../../espace-aidant/Aidant';
import crypto from 'crypto';

export type MatchingAidant = AidantMisEnRelation[];

export type AidantMisEnRelation = {
  email: string;
  nomPrenom: string;
  lienPourPostuler: string;
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

    const lesAidantsDeTest =
      adaptateurEnvironnement.miseEnRelation().aidantsDeTest;

    const matchingAidants: MatchingAidant = lesAidantsDeTest.map((a) => ({
      email: a,
      nomPrenom: 'Un prénom',
      lienPourPostuler: `${adaptateurEnvironnement.mac().urlMAC()}/repondre-a-une-demande?token=${tokenAttributionDemandeAide().chiffre(
        donneesMiseEnRelation.demandeAide,
        crypto.randomUUID()
      )}`,
    }));

    const envoisEmails = matchingAidants.map((a) =>
      this.adaptateurEnvoiMail.envoieMiseEnRelation(donneesMiseEnRelation, a)
    );
    await Promise.all(envoisEmails);
  }
}
