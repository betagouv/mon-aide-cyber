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
  initialiseReducteur,
  reducteurReponse,
  reponseMultipleDonnee,
  reponseTiroirMultipleDonnee,
  reponseTiroirUniqueDonnee,
  reponseUniqueDonnee,
} from "../../domaine/diagnostic/reducteurReponse.ts";
import {
  Action,
  ActionReponseDiagnostic,
} from "../../domaine/diagnostic/Diagnostic.ts";
import "../../assets/styles/_diagnostic.scss";

type ProprietesComposantQuestion = {
  question: Question;
  reponseDonnee?: ReponseDonnee;
  actions: ActionReponseDiagnostic[];
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
    initialiseReducteur(question, actions),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      envoie(reponseUniqueDonnee(event.target.value));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIE) {
      const action = etatReponse.action("repondre");
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
    initialiseReducteur(question, actions),
  );
  const entrepots = useContext(FournisseurEntrepots);

  const repondQuestionUnique = useCallback(
    (identifiantReponse: string) => {
      envoie(reponseUniqueDonnee(identifiantReponse));
    },
    [envoie],
  );

  const repondQuestionMultiple = useCallback(
    (elementReponse: { identifiantReponse: string; reponse: string }) => {
      envoie(reponseMultipleDonnee(elementReponse));
    },
    [envoie],
  );

  const repondQuestionTiroirUnique = useCallback(
    (
      identifiantReponse: string,
      elementReponse: {
        identifiantReponse: string;
        reponse: string;
      },
    ) => {
      envoie(reponseTiroirUniqueDonnee(identifiantReponse, elementReponse));
    },
    [envoie],
  );

  const repondQuestionTiroirMultiple = useCallback(
    (
      identifiantReponse: string,
      elementReponse: {
        identifiantReponse: string;
        reponse: string;
      },
    ) => {
      envoie(reponseTiroirMultipleDonnee(identifiantReponse, elementReponse));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.statut === EtatReponseStatut.MODIFIE) {
      const action = etatReponse.action("repondre");
      if (action !== undefined) {
        entrepots.diagnostic().repond(action, etatReponse.reponse()!);
      }
    }
  }, [actions, entrepots, etatReponse, question]);
  return (
    <>
      {question.reponsesPossibles.map((reponse) => {
        const typeDeSaisie =
          question.type === "choixUnique" ? "radio" : "checkbox";
        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            identifiantQuestion={question.identifiant}
            typeDeSaisie={typeDeSaisie}
            onChange={(identifiantReponse) =>
              typeDeSaisie === "radio"
                ? repondQuestionUnique(identifiantReponse)
                : repondQuestionMultiple({
                    identifiantReponse: question.identifiant,
                    reponse: identifiantReponse,
                  })
            }
            selectionnee={
              typeDeSaisie === "radio"
                ? etatReponse.valeur() === reponse.identifiant
                : etatReponse.reponseDonnee.reponses.some((rep) =>
                    rep.reponses.has(reponse.identifiant),
                  )
            }
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
                      onChange={(identifiantReponse) => {
                        typeDeSaisie === "checkbox"
                          ? repondQuestionTiroirMultiple(reponse.identifiant, {
                              identifiantReponse: questionTiroir.identifiant,
                              reponse: identifiantReponse,
                            })
                          : repondQuestionTiroirUnique(reponse.identifiant, {
                              identifiantReponse: questionTiroir.identifiant,
                              reponse: identifiantReponse,
                            });
                      }}
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
  let actions: Action[] = [];
  if (etatReferentiel.diagnostic?.referentiel !== undefined) {
    thematiques = Object.entries(etatReferentiel.diagnostic!.referentiel!);
    actions = etatReferentiel.diagnostic!.actions;
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
          const actionsPossibles: ActionReponseDiagnostic[] = actions.filter(
            (action) => Object.entries(action).find(([c]) => c === clef),
          ) as ActionReponseDiagnostic[];
          const elements = thematique.questions.map((question) => (
            <fieldset key={question.identifiant} id={question.identifiant}>
              <label>{question.libelle}</label>
              <br />
              {question.type === "liste" ? (
                <ComposantQuestionListe
                  question={question}
                  actions={actionsPossibles}
                />
              ) : (
                <ComposantQuestion
                  question={question}
                  actions={actionsPossibles}
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
