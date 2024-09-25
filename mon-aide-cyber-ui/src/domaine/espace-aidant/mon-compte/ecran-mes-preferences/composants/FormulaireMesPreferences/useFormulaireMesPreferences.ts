import { useCallback, useEffect, useReducer } from 'react';
import {
  chargePreferences,
  EtatPreferences,
  initialiseFormulairePreferences,
  reducteurPreferences,
} from '../reducteurPreferences';
import { useNavigationMAC } from '../../../../../../fournisseurs/hooks';
import { useMACAPI } from '../../../../../../fournisseurs/api/useMACAPI';
import { MoteurDeLiens } from '../../../../../MoteurDeLiens';
import { ReponsePreferencesAPI } from '../../../../../preferences/ReponsePreferencesAPI';
import { constructeurParametresAPI } from '../../../../../../fournisseurs/api/ConstructeurParametresAPI';
import {
  Preferences,
  PreferencesAidantOptionel,
} from './FormulaireMesPreferences.types';

export const useFormulaireMesPreferences = () => {
  const [etatPreferences, envoie] = useReducer(
    reducteurPreferences,
    initialiseFormulairePreferences()
  );
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-preferences',
      (lien) => {
        if (etatPreferences.enCoursDeChargement) {
          return macAPI
            .execute<Preferences, ReponsePreferencesAPI>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              async (reponse) => {
                const reponsePreferencesAPI = await reponse;

                navigationMAC.ajouteEtat(reponsePreferencesAPI.liens);
                return {
                  preferencesAidant: reponsePreferencesAPI.preferencesAidant,
                  referentiel: {
                    typesEntites:
                      reponsePreferencesAPI.referentiel.typesEntites,
                    departements:
                      reponsePreferencesAPI.referentiel.departements,
                    secteursActivite:
                      reponsePreferencesAPI.referentiel.secteursActivite,
                  },
                };
              }
            )
            .then((preferences) => {
              envoie(chargePreferences(preferences));
            });
        }
      }
    );
  }, [navigationMAC.etat]);

  const enregistrePreferences = useCallback(
    (
      etatPreferences: EtatPreferences,
      enSucces?: () => void,
      enErreur?: () => void
    ) => {
      new MoteurDeLiens(navigationMAC.etat).trouve(
        'modifier-preferences',
        (lien) => {
          return macAPI
            .execute<
              void,
              void,
              { preferencesAidant: PreferencesAidantOptionel }
            >(
              constructeurParametresAPI<{
                preferencesAidant: PreferencesAidantOptionel;
              }>()
                .url(lien.url)
                .methode(lien.methode!)
                .corps({
                  preferencesAidant: {
                    ...etatPreferences.preferences.preferencesAidant,
                  },
                })
                .construis(),
              async () => Promise.resolve()
            )
            .then(() => {
              enSucces && enSucces();
            })
            .catch((err) => {
              console.error(err);
              enErreur && enErreur();
            });
        }
      );
    },
    [etatPreferences, navigationMAC.etat]
  );

  return {
    etatPreferences,
    envoie,
    enregistrePreferences,
  };
};
