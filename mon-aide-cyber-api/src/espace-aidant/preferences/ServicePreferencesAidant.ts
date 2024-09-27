import { UUID } from 'crypto';
import { EntrepotAidant, typesEntites } from '../../authentification/Aidant';
import { SecteurActivite, secteurActiviteParNom } from './secteursActivite';
import { rechercheParNomDepartement } from '../../gestion-demandes/departements';

type MetsAJourPreferenceAidant = {
  preferences: {
    departements?: string[];
    typesEntites?: string[];
    secteursActivite?: string[];
  };
  identifiantAidant: UUID;
};

export class ServicePreferencesAidant {
  constructor(private readonly entrepotAidant: EntrepotAidant) {}

  async metsAJour(miseAJour: MetsAJourPreferenceAidant): Promise<void> {
    await this.entrepotAidant
      .lis(miseAJour.identifiantAidant)
      .then((aidant) => {
        if (miseAJour.preferences.secteursActivite) {
          aidant.preferences.secteursActivite =
            miseAJour.preferences.secteursActivite
              .map((s) => secteurActiviteParNom(s))
              .filter((s): s is SecteurActivite => !!s);
        }
        if (miseAJour.preferences.departements) {
          aidant.preferences.departements =
            miseAJour.preferences.departements.map((d) =>
              rechercheParNomDepartement(d)
            );
        }
        if (miseAJour.preferences.typesEntites) {
          aidant.preferences.typesEntites =
            miseAJour.preferences.typesEntites.flatMap((t) =>
              typesEntites.filter((typesEntites) => typesEntites.nom === t)
            );
        }

        return this.entrepotAidant.persiste(aidant);
      });
  }
}
