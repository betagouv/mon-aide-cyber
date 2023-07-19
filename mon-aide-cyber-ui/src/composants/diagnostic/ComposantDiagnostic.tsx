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
} from "../../domaine/diagnostic/Referentiel.ts";
import { UUID } from "../../types/Types.ts";
import {
  diagnosticCharge,
  reducteurDiagnostic,
} from "../../domaine/diagnostic/reducteurDiagnostic.ts";
import { FournisseurEntrepots } from "../../fournisseurs/FournisseurEntrepot.ts";
import {
  reducteurReponse,
  reponseChangee,
} from "../../domaine/diagnostic/reducteurReponse.ts";
import { ActionDiagnostic } from "../../domaine/diagnostic/Diagnostic.ts";

type ProprietesComposantQuestion = {
  question: Question;
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
  reponseDonnee?: ReponseDonnee;
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
      ></input>
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
  const [etatReponse, envoie] = useReducer(reducteurReponse, {
    reponseDonnee: question.reponseDonnee,
  });
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      envoie(reponseChangee(event.target.value));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.reponseDonnee !== undefined) {
      const action = actions?.find((a) => a.action === "repondre");
      if (action !== undefined) {
        entrepots.diagnostic().repond(action, {
          reponseDonnee: etatReponse.reponseDonnee.valeur,
          identifiantQuestion: question.identifiant,
        });
      }
    }
  }, [actions, entrepots, etatReponse, question]);

  return (
    <select
      role="listbox"
      id={question.identifiant}
      name={question.identifiant}
      onChange={repond}
      value={etatReponse.reponseDonnee?.valeur}
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

const ComposantQuestionTiroir = ({ question }: ProprietesComposantQuestion) => {
  return (
    <div className="question-tiroir">
      <br />
      <label>{question?.libelle}</label>
      <br />
      {question?.reponsesPossibles.map((reponse) => {
        const typeDeSaisie =
          question.type === "choixMultiple" ? "checkbox" : "radio";

        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            identifiantQuestion={question.identifiant}
            typeDeSaisie={typeDeSaisie}
            reponseDonnee={undefined}
            selectionnee={false}
            onChange={() => {
              // TODO Prendre en compte les réponses des question à tiroir
            }}
          />
        );
      })}
    </div>
  );
};

const ComposantQuestion = ({
  question,
  actions,
}: ProprietesComposantQuestion) => {
  const [etatReponse, envoie] = useReducer(reducteurReponse, {
    reponseDonnee: question.reponseDonnee,
  });
  const entrepots = useContext(FournisseurEntrepots);

  const repond = useCallback(
    (identifiantReponse: string) => {
      envoie(reponseChangee(identifiantReponse));
    },
    [envoie],
  );

  useEffect(() => {
    if (etatReponse.reponseDonnee !== undefined) {
      const action = actions?.find((a) => a.action === "repondre");
      if (action !== undefined) {
        entrepots.diagnostic().repond(action, {
          reponseDonnee: etatReponse.reponseDonnee.valeur,
          identifiantQuestion: question.identifiant,
        });
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
            reponseDonnee={question.reponseDonnee}
            onChange={(identifiantReponse) => repond(identifiantReponse)}
            selectionnee={
              etatReponse.reponseDonnee?.valeur === reponse.identifiant
            }
          >
            {reponse.question !== undefined ? (
              <ComposantQuestionTiroir
                question={reponse.question}
                actions={actions}
              />
            ) : (
              ""
            )}
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

  const contexte = etatReferentiel.diagnostic?.referentiel?.contexte;
  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section className="question">
          <div>
            {contexte?.questions.map((question) => (
              <fieldset key={question.identifiant} id={question.identifiant}>
                <label>{question.libelle}</label>
                <br />
                {question.type === "liste" ? (
                  <ComposantQuestionListe
                    question={question}
                    actions={contexte.actions}
                  />
                ) : (
                  <ComposantQuestion
                    question={question}
                    actions={contexte.actions}
                  />
                )}
              </fieldset>
            ))}
          </div>
        </section>
      </form>
    </>
  );
};
