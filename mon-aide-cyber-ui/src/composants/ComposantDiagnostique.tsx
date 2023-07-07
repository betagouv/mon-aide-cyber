import { PropsWithChildren, useContext, useEffect, useReducer } from "react";
import {
  Question,
  ReponsePossible,
} from "../domaine/diagnostique/Referentiel.ts";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { UUID } from "../types/Types.ts";
import {
  diagnostiqueCharge,
  reducteurDiagnostique,
} from "../domaine/diagnostique/reducteurs.ts";
import { useErrorBoundary } from "react-error-boundary";

type ProprietesComposantQuestion = {
  question: Question;
};

type ProprietesComposantReponsePossible = {
  reponsePossible: ReponsePossible;
  identifiantQuestion: string;
  typeDeSaisie: "radio" | "checkbox";
};
const ComposantReponsePossible = (
  proprietes: PropsWithChildren<ProprietesComposantReponsePossible>,
) => {
  const champsASaisir =
    proprietes.reponsePossible.type?.type === "saisieLibre" ? (
      <input
        id={`asaisir-${proprietes.reponsePossible.identifiant}`}
        name={proprietes.reponsePossible.identifiant}
        type="text"
        required={true}
      />
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
      ></input>
      <label htmlFor={proprietes.reponsePossible.identifiant}>
        {proprietes.reponsePossible.libelle}
      </label>
      <div>{champsASaisir}</div>
      {proprietes.children}
      <br />
    </>
  );
};

const ComposantQuestionListe = ({ question }: ProprietesComposantQuestion) => {
  return (
    <select
      role="listbox"
      id={question.identifiant}
      name={question.identifiant}
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

const ComposantQuestion = ({ question }: ProprietesComposantQuestion) => {
  return (
    <>
      {question.reponsesPossibles.map((reponse) => {
        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            identifiantQuestion={question.identifiant}
            typeDeSaisie="radio"
          >
            {reponse.question?.type === "choixMultiple" ? (
              <div className="question-tiroir">
                <br />
                <label>{reponse.question?.libelle}</label>
                <br />
                {reponse.question.reponsesPossibles.map((reponse) => {
                  return (
                    <ComposantReponsePossible
                      key={reponse.identifiant}
                      reponsePossible={reponse}
                      identifiantQuestion={question.identifiant}
                      typeDeSaisie="checkbox"
                    />
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </ComposantReponsePossible>
        );
      })}
    </>
  );
};
type ProprietesComposantDiagnostique = {
  idDiagnostique: UUID;
};

export const ComposantDiagnostique = ({
  idDiagnostique,
}: ProprietesComposantDiagnostique) => {
  const [etatReferentiel, envoie] = useReducer(reducteurDiagnostique, {
    diagnostique: undefined,
  });

  const entrepots = useContext(FournisseurEntrepots);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    entrepots
      .diagnostique()
      .lis(idDiagnostique)
      .then((diagnostique) => {
        envoie(diagnostiqueCharge(diagnostique));
      })
      .catch((erreur) => showBoundary(erreur));
  }, [entrepots, idDiagnostique, envoie, showBoundary]);

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section className="question">
          <div>
            {etatReferentiel.diagnostique?.referentiel?.contexte.questions.map(
              (question) => (
                <fieldset key={question.identifiant} id={question.identifiant}>
                  <label>{question.libelle}</label>
                  <br />
                  {question.type === "liste" ? (
                    <ComposantQuestionListe question={question} />
                  ) : (
                    <ComposantQuestion question={question} />
                  )}
                </fieldset>
              ),
            )}
          </div>
        </section>
      </form>
    </>
  );
};
