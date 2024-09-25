import { ReactElement, useState } from 'react';
import Button from '../../../../../composants/atomes/Button/Button';
import { TypographieH4 } from '../../../../../composants/communs/typographie/TypographieH4/TypographieH4';
import {
  cochePreference,
  cocheToutesLesPreferences,
  decocheToutesLesPreferences,
} from './reducteurPreferences';
import { Toast } from '../../../../../composants/communs/Toasts/Toast.tsx';
import { ChampCaseACocher } from '../../../../../composants/communs/ChampCaseACocher/ChampCaseACocher.tsx';
import { useFormulaireMesPreferences } from './FormulaireMesPreferences/useFormulaireMesPreferences.ts';

export const FormulaireMesPreferences = () => {
  const { etatPreferences, envoie, enregistrePreferences } =
    useFormulaireMesPreferences();

  const [
    messageEnregistrementTypesEntite,
    setMessageEnregistrementTypesEntite,
  ] = useState<ReactElement | undefined>(undefined);
  const [
    messageEnregistrementSecteursActivite,
    setMessageEnregistrementSecteursActivite,
  ] = useState<ReactElement | undefined>(undefined);
  const [
    messageEnregistrementSecteursGeographique,
    setMessageEnregistrementSecteursGeographique,
  ] = useState<ReactElement | undefined>(undefined);

  const enregistreTypesEntites = (typesEntites: string[] | undefined) => {
    enregistrePreferences(
      {
        ...etatPreferences,
        preferences: {
          ...etatPreferences.preferences,
          preferencesAidant: {
            typesEntites: typesEntites,
          },
        },
      },
      () => {
        setMessageEnregistrementTypesEntite(
          <Toast
            message="Vos types d'entité ont bien été enregistrés !"
            type="INFO"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementTypesEntite((_prev) => undefined);
        }, 10000);
      },
      () => {
        setMessageEnregistrementTypesEntite(
          <Toast
            message="Une erreur est survenue lors de l'enregistrement de vos types d'entité"
            type="ERREUR"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementTypesEntite((_prev) => undefined);
        }, 10000);
      }
    );
  };

  const enregistreSecteursActivite = (
    secteursActivite: string[] | undefined
  ) => {
    enregistrePreferences(
      {
        ...etatPreferences,
        preferences: {
          ...etatPreferences.preferences,
          preferencesAidant: {
            secteursActivite: secteursActivite,
          },
        },
      },
      () => {
        setMessageEnregistrementSecteursActivite(
          <Toast
            message="Vos secteurs d'activité ont bien été enregistrés !"
            type="INFO"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementSecteursActivite((_prev) => undefined);
        }, 10000);
      },
      () => {
        setMessageEnregistrementTypesEntite(
          <Toast
            message="Une erreur est survenue lors de l'enregistrement de vos secteurs d'activité"
            type="ERREUR"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementTypesEntite((_prev) => undefined);
        }, 10000);
      }
    );
  };

  const enregistreDepartements = (departements: string[] | undefined) => {
    enregistrePreferences(
      {
        ...etatPreferences,
        preferences: {
          ...etatPreferences.preferences,
          preferencesAidant: {
            departements: departements,
          },
        },
      },
      () => {
        setMessageEnregistrementSecteursGeographique(
          <Toast
            message="Vos secteurs géographiques ont bien été enregistrés !"
            type="INFO"
          />
        );
        setTimeout(() => {
          setMessageEnregistrementSecteursGeographique((_prev) => undefined);
        }, 10000);
        () => {
          setMessageEnregistrementTypesEntite(
            <Toast
              message="Une erreur est survenue lors de l'enregistrement de vos secteurs géographiques"
              type="ERREUR"
            />
          );
          setTimeout(() => {
            setMessageEnregistrementTypesEntite((_prev) => undefined);
          }, 10000);
        };
      }
    );
  };

  return (
    <form>
      <div>
        <TypographieH4>Types d&apos;entité</TypographieH4>
        <p>Auprès de quels types d’entités souhaitez-vous intervenir ?</p>

        <div className="section-preference-formulaire">
          <span className="aide-formulaire">Plusieurs réponses possibles</span>
          <div className="fr-checkbox-group mac-radio-group grille-preferences-types-entites">
            {etatPreferences.preferences?.referentiel.typesEntites.map((x) => (
              <ChampCaseACocher
                key={x.nom}
                label={x.libelle}
                element={{
                  code: x.nom,
                  nom: x.libelle,
                }}
                checked={
                  !!etatPreferences.preferences.preferencesAidant
                    ?.typesEntites &&
                  !!etatPreferences.preferences.preferencesAidant?.typesEntites.find(
                    (y) => y === x.nom
                  )
                }
                onChange={() => envoie(cochePreference(x.nom, 'TYPE_ENTITE'))}
              />
            ))}
          </div>{' '}
          {messageEnregistrementTypesEntite}
          <div>
            <Button
              type="button"
              disabled={!etatPreferences.preferencesChangees.typesEntites}
              onClick={() =>
                enregistreTypesEntites(
                  etatPreferences.preferences.preferencesAidant?.typesEntites
                )
              }
            >
              Enregistrer les types d&apos;entité
            </Button>
          </div>
        </div>
      </div>
      <div className="separateur sombre" />
      <div>
        <TypographieH4>Secteurs d&apos;activité</TypographieH4>
        <p>
          Avez-vous des préférences sur les secteurs d’activités de vos
          interventions ?
        </p>
        <div className="section-preference-formulaire">
          <span className="aide-formulaire">Plusieurs réponses possibles</span>
          <div className="boutons-tout-selectionner-conteneur">
            <Button
              variant="link"
              type="button"
              disabled={
                !!etatPreferences.preferences.preferencesAidant
                  .secteursActivite &&
                etatPreferences.preferences.preferencesAidant.secteursActivite
                  .length ===
                  etatPreferences.preferences.referentiel.secteursActivite
                    .length
              }
              onClick={() =>
                envoie(cocheToutesLesPreferences('SECTEUR_ACTIVITE'))
              }
            >
              Tout sélectionner
            </Button>{' '}
            |
            <Button
              variant="link"
              type="button"
              disabled={
                etatPreferences.preferences.preferencesAidant.secteursActivite
                  ?.length === 0
              }
              onClick={() =>
                envoie(decocheToutesLesPreferences('SECTEUR_ACTIVITE'))
              }
            >
              Tout désélectionner
            </Button>
          </div>
          <div className="fr-checkbox-group mac-radio-group grille-preferences deux-colonnes">
            {etatPreferences.preferences?.referentiel.secteursActivite.map(
              (x) => (
                <ChampCaseACocher
                  key={x}
                  label={x}
                  element={{
                    code: x,
                    nom: x,
                  }}
                  checked={
                    !!etatPreferences.preferences.preferencesAidant
                      .secteursActivite &&
                    !!etatPreferences.preferences.preferencesAidant.secteursActivite.find(
                      (y) => y === x
                    )
                  }
                  onChange={() =>
                    envoie(cochePreference(x, 'SECTEUR_ACTIVITE'))
                  }
                />
              )
            )}
          </div>{' '}
          {messageEnregistrementSecteursActivite}
          <div>
            <Button
              type="button"
              disabled={!etatPreferences.preferencesChangees.secteursActivite}
              onClick={() =>
                enregistreSecteursActivite(
                  etatPreferences.preferences.preferencesAidant
                    ?.secteursActivite
                )
              }
            >
              Enregistrer les secteurs d&apos;activité
            </Button>
          </div>
        </div>
      </div>
      <div className="separateur sombre" />
      <div>
        <TypographieH4>Secteurs géographiques</TypographieH4>
        <p>
          Êtes-vous mobile sur le territoire ? Sélectionnez au moins 1
          territoire sur lequel vous pouvez intervenir.
        </p>

        <div className="section-preference-formulaire">
          <span className="aide-formulaire">Plusieurs réponses possibles</span>
          <div className="fr-checkbox-group mac-radio-group grille-preferences trois-colonnes">
            {etatPreferences.preferences?.referentiel.departements.map((x) => (
              <ChampCaseACocher
                key={x.code}
                label={`${x.code} - ${x.nom}`}
                element={{
                  code: x.code,
                  nom: x.nom,
                }}
                checked={
                  !!etatPreferences.preferences.preferencesAidant
                    .departements &&
                  !!etatPreferences.preferences.preferencesAidant.departements.find(
                    (y) => y === x.nom
                  )
                }
                onChange={() =>
                  envoie(cochePreference(x.nom, 'SECTEUR_GEOGRAPHIQUE'))
                }
              />
            ))}
          </div>{' '}
          {messageEnregistrementSecteursGeographique}
          <div>
            <Button
              type="button"
              disabled={!etatPreferences.preferencesChangees.departements}
              onClick={() =>
                enregistreDepartements(
                  etatPreferences.preferences.preferencesAidant?.departements
                )
              }
            >
              Enregistrer les secteurs géographiques
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
