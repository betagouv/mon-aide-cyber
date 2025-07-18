import {
  FormEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { Departement, estDepartement } from '../../departement';
import { AutoCompletion } from '../../../../composants/auto-completion/AutoCompletion';
import {
  cguCliquees,
  initialiseFormulaire,
  reducteurDevenirAidant,
  saisieDepartement,
  saisieMail,
  saisieNom,
  saisiPrenom,
} from './reducteurDevenirAidant.ts';
import { Input } from '../../../../composants/atomes/Input/Input.tsx';
import { ChampValidationCGUs } from '../../../../composants/formulaires/ChampValidationCGUs.tsx';
import { ReponseDemandeInitiee } from '../DevenirAidant.ts';

export type ChampsFormulaireDevenirAidant = {
  nom: string;
  prenom: string;
  mail: string;
  departement: string;
  cguValidees: boolean;
};

type ProprietesFormulaireDevenirAidant = PropsWithChildren<{
  informationsLieesALaDemande?: ReponseDemandeInitiee;
  surSoumission: ({
    nom,
    prenom,
    mail,
    departement,
    cguValidees,
  }: ChampsFormulaireDevenirAidant) => void;
  devientValide: (estValide: boolean) => void;
}>;

export const FormulaireDevenirAidant = ({ children }: PropsWithChildren) => {
  return (
    <div className="fr-container fr-grid-row fr-grid-row--center formulaire-devenir-aidant-layout">
      <div className="fr-col-md-8 fr-col-sm-12 section">
        <div>{children}</div>
      </div>
    </div>
  );
};

const FormulaireDevenirAidantAvantPropos = ({
  children,
}: PropsWithChildren) => {
  return <div>{children}</div>;
};

const FormulaireDevenirAidantFormulaire = ({
  informationsLieesALaDemande,
  surSoumission,
  devientValide,
  children,
}: PropsWithChildren<ProprietesFormulaireDevenirAidant>) => {
  const [etatDemande, envoie] = useReducer(
    reducteurDevenirAidant,
    initialiseFormulaire(informationsLieesALaDemande?.donneesUtilisateur)
  );

  const soumetFormulaire = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    surSoumission({
      nom: etatDemande.nom,
      prenom: etatDemande.prenom,
      mail: etatDemande.mail,
      departement: estDepartement(etatDemande.departement)
        ? etatDemande.departement.nom
        : etatDemande.departement,
      cguValidees: etatDemande.cguValidees,
    });
  };

  useEffect(() => {
    devientValide(etatDemande.pretPourEnvoi);
  }, [etatDemande.pretPourEnvoi]);

  const surSaisiePrenom = useCallback((saisie: string) => {
    envoie(saisiPrenom(saisie));
  }, []);

  const surSaisieNom = useCallback((saisie: string) => {
    envoie(saisieNom(saisie));
  }, []);

  const surSaisieMail = useCallback((saisie: string) => {
    envoie(saisieMail(saisie));
  }, []);

  const surSaisieDepartement = useCallback((saisie: Departement | string) => {
    envoie(saisieDepartement(saisie));
  }, []);

  const surCGUValidees = useCallback(() => {
    envoie(cguCliquees());
  }, []);

  return (
    <form onSubmit={soumetFormulaire}>
      <div className="champs-obligatoire">
        <span className="asterisque">*</span>
        <span> Champ obligatoire</span>
      </div>
      <fieldset className="fr-mb-5w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 champs">
            <div
              className={`fr-input-group ${etatDemande.erreurs?.prenom ? 'fr-input-group--error' : ''}`}
            >
              <label className="fr-label" htmlFor="prenom">
                <span className="asterisque">*</span>
                <span> Votre prénom :</span>
              </label>
              <input
                className="fr-input"
                type="text"
                id="prenom"
                name="prenom"
                value={informationsLieesALaDemande?.donneesUtilisateur?.prenom}
                disabled={!!informationsLieesALaDemande?.donneesUtilisateur}
                placeholder="Exemple : Martin"
                onChange={(e) => surSaisiePrenom(e.target.value)}
              />
              {etatDemande.erreurs?.prenom ? (
                <p className="fr-error-text">{etatDemande.erreurs?.prenom}</p>
              ) : null}
            </div>
          </div>
          <div className="fr-col-12 champs">
            <div
              className={`fr-input-group ${etatDemande.erreurs?.nom ? 'fr-input-group--error' : ''}`}
            >
              <label className="fr-label" htmlFor="nom">
                <span className="asterisque">*</span>
                <span> Votre nom :</span>
              </label>
              <input
                className="fr-input"
                type="text"
                id="nom"
                name="nom"
                value={informationsLieesALaDemande?.donneesUtilisateur?.nom}
                disabled={!!informationsLieesALaDemande?.donneesUtilisateur}
                placeholder="Exemple : Dubois"
                onChange={(e) => surSaisieNom(e.target.value)}
              />
              {etatDemande.erreurs?.nom ? (
                <p className="fr-error-text">{etatDemande.erreurs?.nom}</p>
              ) : null}
            </div>
          </div>
          <div className="fr-col-12 champs">
            <div
              className={`fr-input-group ${etatDemande.erreurs?.mail ? 'fr-input-group--error' : ''}`}
            >
              <label className="fr-label" htmlFor="mail">
                <span className="asterisque">*</span>
                <span> Votre adresse électronique :</span>
              </label>
              <Input
                type="text"
                id="mail"
                name="mail"
                value={informationsLieesALaDemande?.donneesUtilisateur?.email}
                disabled={!!informationsLieesALaDemande?.donneesUtilisateur}
                placeholder="Exemple : jean.dupont@mail.com"
                onChange={(e) => surSaisieMail(e.target.value)}
              />
              {etatDemande.erreurs?.mail ? (
                <p className="fr-error-text">{etatDemande.erreurs?.mail}</p>
              ) : null}
            </div>
          </div>
          <div className="fr-col-12 champs">
            <div
              className={`fr-input-group ${etatDemande.erreurs?.departement ? 'fr-input-group--error' : ''}`}
            >
              <label className="fr-label" htmlFor="departement-drom-com">
                <span className="asterisque">*</span>
                <span>
                  {' '}
                  Dans quel département ou DROM-COM êtes-vous situé ?
                </span>
              </label>

              <AutoCompletion<Departement>
                nom="departement"
                suggestionsInitiales={
                  informationsLieesALaDemande?.departements || []
                }
                mappeur={(departement) =>
                  estDepartement(departement)
                    ? `${departement.code} - ${departement.nom}`
                    : departement
                }
                surSelection={(departement) => {
                  surSaisieDepartement(departement);
                }}
                surSaisie={(departement) => {
                  surSaisieDepartement(departement);
                }}
                clefsFiltrage={['code', 'nom']}
                valeurSaisie={etatDemande.departement as Departement}
                placeholder="Exemple : Gironde"
              />
              {etatDemande.erreurs?.departement ? (
                <p className="fr-error-text">
                  {etatDemande.erreurs?.departement}
                </p>
              ) : null}
            </div>
          </div>
          <div className="fr-col-12 champs">
            <ChampValidationCGUs
              sontValidees={etatDemande.cguValidees}
              surCguCliquees={surCGUValidees}
              erreur={etatDemande.erreurs?.cguValidees}
            />
            {etatDemande.erreurs?.cguValidees ? (
              <p className="fr-error-text">
                {etatDemande.erreurs?.cguValidees}
              </p>
            ) : null}
          </div>
        </div>
        <div className="fr-grid-row fr-grid-row--right fr-pt-3w">
          {children}
        </div>
      </fieldset>
    </form>
  );
};

FormulaireDevenirAidant.AvantPropos = FormulaireDevenirAidantAvantPropos;
FormulaireDevenirAidant.Formulaire = FormulaireDevenirAidantFormulaire;
