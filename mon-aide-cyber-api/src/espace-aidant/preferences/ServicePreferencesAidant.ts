import crypto, { UUID } from 'crypto';
import { EntrepotAidant, typesEntites } from '../../authentification/Aidant';
import { SecteurActivite, secteurActiviteParNom } from './secteursActivite';
import { rechercheParNomDepartement } from '../../gestion-demandes/departements';
import { BusEvenement, Evenement } from '../../domaine/BusEvenement';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

type MetsAJourPreferenceAidant = {
  preferences: {
    departements?: string[];
    typesEntites?: string[];
    secteursActivite?: string[];
  };
  identifiantAidant: UUID;
};

export class ServicePreferencesAidant {
  constructor(
    private readonly entrepotAidant: EntrepotAidant,
    private readonly busEvenement: BusEvenement
  ) {}

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

        return this.entrepotAidant.persiste(aidant).then(() =>
          this.busEvenement.publie<PreferencesAidantModifiees>({
            identifiant: aidant.identifiant,
            type: 'PREFERENCES_AIDANT_MODIFIEES',
            date: FournisseurHorloge.maintenant(),
            corps: {
              identifiant: aidant.identifiant,
              preferences: {
                ...(miseAJour.preferences.secteursActivite && {
                  secteursActivite: aidant.preferences.secteursActivite.map(
                    (s) => s.nom
                  ),
                }),
                ...(miseAJour.preferences.departements && {
                  departements: aidant.preferences.departements.map(
                    (d) => d.code
                  ),
                }),
                ...(miseAJour.preferences.typesEntites && {
                  typesEntites: aidant.preferences.typesEntites.map(
                    (t) => t.libelle
                  ),
                }),
              },
            },
          })
        );
      });
  }
}

export type PreferencesAidantModifiees = Evenement<{
  identifiant: crypto.UUID;
  preferences: {
    departements?: string[];
    secteursActivite?: string[];
    typesEntites?: string[];
  };
}>;
