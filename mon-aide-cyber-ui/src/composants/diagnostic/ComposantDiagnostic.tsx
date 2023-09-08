import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
  Question,
  ReponseComplementaire,
  ReponseDonnee,
  ReponsePossible,
  Thematique,
} from "../../domaine/diagnostic/Referentiel.ts";
import { UUID } from "../../types/Types.ts";
import {
  diagnosticCharge,
  reducteurDiagnostic,
  thematiqueAffichee,
} from "../../domaine/diagnostic/reducteurDiagnostic.ts";
import { FournisseurEntrepots } from "../../fournisseurs/FournisseurEntrepot.ts";
import {
  EtatReponseStatut,
  reducteurReponse,
  reponseChangee,
  initialiseReducteur,
} from "../../domaine/diagnostic/reducteurReponse.ts";
import { ActionDiagnostic } from "../../domaine/diagnostic/Diagnostic.ts";
import "../../assets/styles/_diagnostic.scss";

type ProprietesComposantQuestion = {
  question: Question;
  reponseDonnee?: ReponseDonnee;
  actions?: ActionDiagnostic[];
};

type ProprietesChampsDeSaisie = {
  identifiant: string;
};

const ChampsDeSaisie = ({ identifiant }: ProprietesChampsDeSaisie) => {
  return (
    <div>
      <input
        id={`asaisir-${identifiant}`}
        name={identifiant}
        type="text"
        required={true}
      />
    </div>
  );
};

type PropprietesComposantReponseComplementaire = {
  reponseComplementaire: ReponseComplementaire;
};

const ComposantReponseComplementaire = ({
  reponseComplementaire,
}: PropprietesComposantReponseComplementaire) => {
  const champsASaisir =
    reponseComplementaire.type?.type === "saisieLibre" ? (
      <ChampsDeSaisie identifiant={reponseComplementaire.identifiant} />
    ) : (
      ""
    );
  return (
    <>
      <input
        id={reponseComplementaire.identifiant}
        type="checkbox"
        name={reponseComplementaire.identifiant}
        value={reponseComplementaire.identifiant}
      ></input>
      <label htmlFor={reponseComplementaire.identifiant}>
        {reponseComplementaire.libelle}
      </label>
      {champsASaisir}
      <br />
    </>
  );
};
type ProprietesComposantReponsePossible = {
  identifiantQuestion: string;
  reponsePossible: ReponsePossible;
  typeDeSaisie: "radio" | "checkbox";
  onChange: (identifiantReponse: string) => void;
  selectionnee: boolean;
};

const ComposantReponsePossible = (
  proprietes: PropsWithChildren<ProprietesComposantReponsePossible>,
) => {
  const champsASaisir =
    proprietes.reponsePossible.type?.type === "saisieLibre" ? (
      <ChampsDeSaisie identifiant={proprietes.reponsePossible.identifiant} />
    ) : (
      ""
    );

  return (
    <>
      <input
        id={proprietes.reponsePossible.identifiant}
        type={proprietes.typeDeSaisie}
        name={proprietes.identifiantQuestion}
        value={proprietes.reponsePossible.identifiant}
        checked={proprietes.selectionnee}
        onChange={(event) => {
          proprietes.onChange(event.target.value);
        }}
      />
      <label htmlFor={proprietes.reponsePossible.identifiant}>
        {proprietes.reponsePossible.libelle}
      </label>
      <div>{champsASaisir}</div>
      {proprietes.reponsePossible.reponsesComplementaires !== undefined ? (
        <div className="reponses-complementaires">
          {proprietes.reponsePossible.reponsesComplementaires.map((reponse) => {
            return (
              <ComposantReponseComplementaire
                key={reponse.identifiant}
                reponseComplementaire={reponse}
              />
            );
          })}
        </div>
      ) : (
        ""
      )}

      {proprietes.children}
      <br />
    </>
  );
};

const ComposantQuestionListe = ({
  question,
  actions,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      envoie(reponseChangee(event.target.value));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIE) {
      const action = actions?.find((a) => a.action === "repondre");
      if (action !== undefined) {
        entrepots.diagnostic().repond(action, etatReponse.reponse()!);
      }
    }
  }, [actions, entrepots, etatReponse, question]);

  return (
    <select
      role="listbox"
      id={question.identifiant}
      name={question.identifiant}
      onChange={repond}
      value={etatReponse.valeur()}
    >
      {question.reponsesPossibles.map((reponse) => {
        return (
          <option key={reponse.identifiant} value={reponse.identifiant}>
            {reponse.libelle}
          </option>
        );
      })}
    </select>
  );
};

const ComposantQuestion = ({
  question,
  actions,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(
    reducteurReponse,
    initialiseReducteur(question),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (identifiantReponse: string) => {
      envoie(reponseChangee(identifiantReponse));
    },
    [envoie],
  );

  const repondChoixMultiple = useCallback(
    (
      identifiantReponse: string,
      elementReponseMultiple: {
        identifiantReponse: string;
        elementReponse: string;
      },
    ) => {
      envoie(reponseChangee(identifiantReponse, elementReponseMultiple));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIE) {
      const action = actions?.find((a) => a.action === "repondre");
      if (action !== undefined) {
        entrepots.diagnostic().repond(action, etatReponse.reponse()!);
      }
    }
  }, [actions, entrepots, etatReponse, question]);
  return (
    <>
      {question.reponsesPossibles.map((reponse) => {
        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            identifiantQuestion={question.identifiant}
            typeDeSaisie="radio"
            onChange={(identifiantReponse) => repond(identifiantReponse)}
            selectionnee={etatReponse.valeur() === reponse.identifiant}
          >
            {reponse.questions?.map((questionTiroir) => (
              <div className="question-tiroir" key={questionTiroir.identifiant}>
                <br />
                <label>{questionTiroir.libelle}</label>
                <br />
                {questionTiroir.reponsesPossibles.map((rep) => {
                  const typeDeSaisie =
                    questionTiroir?.type === "choixMultiple"
                      ? "checkbox"
                      : "radio";

                  return (
                    <ComposantReponsePossible
                      key={rep.identifiant}
                      reponsePossible={rep}
                      identifiantQuestion={questionTiroir.identifiant}
                      typeDeSaisie={typeDeSaisie}
                      selectionnee={etatReponse.reponseDonnee.reponses.some(
                        (reponse) => reponse.reponses.has(rep.identifiant),
                      )}
                      onChange={(identifiantReponse) =>
                        repondChoixMultiple(reponse.identifiant, {
                          identifiantReponse: questionTiroir.identifiant,
                          elementReponse: identifiantReponse,
                        })
                      }
                    />
                  );
                })}
              </div>
            ))}
          </ComposantReponsePossible>
        );
      })}
    </>
  );
};

type ProprietesComposantDiagnostic = {
  idDiagnostic: UUID;
};

export const ComposantDiagnostic = ({
  idDiagnostic,
}: ProprietesComposantDiagnostic) => {
  const [etatReferentiel, envoie] = useReducer(reducteurDiagnostic, {
    diagnostic: undefined,
    thematiqueAffichee: undefined,
  });

  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    entrepots
      .diagnostic()
      .lis(idDiagnostic)
      .then((diagnostic) => envoie(diagnosticCharge(diagnostic)))
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, idDiagnostic, envoie, showBoundary]);

  let thematiques: [string, Thematique][] = [];
  if (etatReferentiel.diagnostic?.referentiel !== undefined) {
    thematiques = Object.entries(etatReferentiel.diagnostic!.referentiel!);
  }

  const affiche = useCallback(
    (clef: string) => {
      envoie(thematiqueAffichee(clef));
    },
    [envoie],
  );

  const navigation = (
    <div className="navigation-verticale">
      <nav>
        <ul>
          {thematiques.map(([clef, _]) => (
            <li key={`li-${clef}`}>
              <input
                type="button"
                className=""
                onClick={() => affiche(clef)}
                value={clef.charAt(0).toUpperCase()}
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="diagnostic">
      {navigation}
      <div className="contenu">
        {thematiques.map(([clef, thematique]) => {
          const elements = thematique.questions.map((question) => (
            <fieldset key={question.identifiant} id={question.identifiant}>
              <label>{question.libelle}</label>
              <br />
              {question.type === "liste" ? (
                <ComposantQuestionListe
                  question={question}
                  actions={thematique.actions}
                />
              ) : (
                <ComposantQuestion
                  question={question}
                  actions={thematique.actions}
                />
              )}
            </fieldset>
          ));
          return (
            <form
              key={clef}
              id={clef}
              className={
                etatReferentiel.thematiqueAffichee === clef
                  ? `visible`
                  : `invisible`
              }
            >
              <h2>{clef}</h2>
              <section className="question">
                <div>{elements}</div>
              </section>
            </form>
          );
        })}
      </div>
    </div>
  );
};
