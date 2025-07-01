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
import { AdaptateurGeographie } from '../../adaptateurs/AdaptateurGeographie';
import {
  AdaptateurRechercheEntreprise,
  Entreprise,
} from '../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { fabriqueGestionnaireErreurs } from '../../infrastructure/adaptateurs/fabriqueGestionnaireErreurs';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';

export type AidantMisEnRelation = {
  email: string;
  nomPrenom: string;
  lienPourPostuler: string;
};

export type TonkenAttributionDemandeAide = {
  emailDemande: string;
  identifiantDemande: crypto.UUID;
  identifiantAidant: crypto.UUID;
};

type GestionTokenAttributionDemandeAide = {
  chiffre: (
    emailDemande: string,
    identifiantDemande: crypto.UUID,
    identifiantAidant: crypto.UUID
  ) => string;
  dechiffre: (token: string) => TonkenAttributionDemandeAide;
};

export const tokenAttributionDemandeAide = (
  serviceDeChiffrement: ServiceDeChiffrement = adaptateurServiceChiffrement()
): GestionTokenAttributionDemandeAide => {
  return {
    chiffre(
      emailDemande: string,
      identifiantDemande: crypto.UUID,
      identifiantAidant: crypto.UUID
    ): string {
      return btoa(
        serviceDeChiffrement.chiffre(
          JSON.stringify({
            emailDemande,
            identifiantDemande,
            identifiantAidant,
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
    private readonly entrepots: Entrepots,
    private readonly adaptateurRechercheEntreprise: AdaptateurRechercheEntreprise,
    private readonly adaptateurGeo: AdaptateurGeographie
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
      try {
        await this.informeAidantsDeLaDemandeAide(
          aidants,
          donneesMiseEnRelation
        );
      } catch (e: unknown | Error) {
        fabriqueGestionnaireErreurs()
          .consignateur()
          .consigne(
            new ErreurEnvoiEmail(
              'Erreur lors de l’envoi du mail aux Aidants qui matchent. Mais le process n’est pas interrompu !!',
              { cause: e as Error }
            )
          );
        console.error(e);
      }
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
      aidants
    );
    const entreprise =
      (await this.adaptateurRechercheEntreprise.rechercheParSiret(
        donneesMiseEnRelation.siret
      )) as Entreprise;
    const epci = await this.adaptateurGeo.epciAvecCode(entreprise.codeEpci);

    await this.adaptateurEnvoiMail.envoiToutesLesMisesEnRelation(
      matchingAidants,
      {
        departement: donneesMiseEnRelation.demandeAide.departement.nom,
        epci: epci.nom,
        typeEntite: donneesMiseEnRelation.typeEntite.nom,
        secteursActivite: donneesMiseEnRelation.secteursActivite
          .map((s) => s.nom)
          .join(','),
      }
    );
  }

  private aidantsPourPostuler = (
    demandeAide: DemandeAide,
    aidants: Aidant[]
  ): AidantMisEnRelation[] => {
    const urlMAC = adaptateurEnvironnement.mac().urlMAC();
    const { chiffre } = tokenAttributionDemandeAide();

    return aidants.map((aidant) => ({
      email: aidant.email,
      nomPrenom: aidant.nomPrenom,
      lienPourPostuler: `${urlMAC}/repondre-a-une-demande?token=${chiffre(demandeAide.email, demandeAide.identifiant, aidant.identifiant)}`,
    }));
  };
}
