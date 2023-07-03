import { useContext, useEffect, useReducer } from "react";
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

type ProprietesComposantQuestion = {
  question: Question;
};

type ProprietesComposantReponsePossible = {
  reponsePossible: ReponsePossible;
  identifiantQuestion: string;
};

const ComposantReponsePossible = ({
  reponsePossible,
  identifiantQuestion,
}: ProprietesComposantReponsePossible) => {
  const champsASaisir =
    reponsePossible.type?.type === "saisieLibre" ? (
      <input
        id={"asaisir-" + reponsePossible.identifiant}
        name={reponsePossible.identifiant}
        type="text"
        required={true}
      />
    ) : (
      ""
    );

  return (
    <>
      <input
        id={reponsePossible.identifiant}
        type="radio"
        name={identifiantQuestion}
        value={reponsePossible.identifiant}
      ></input>
      <label htmlFor={reponsePossible.identifiant}>
        {reponsePossible.libelle}
      </label>
      {champsASaisir}
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

const ComposantQuestionSimple = ({ question }: ProprietesComposantQuestion) => {
  return (
    <>
      {question.reponsesPossibles.map((reponse) => {
        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            identifiantQuestion={question.identifiant}
          />
        );
      })}
    </>
  );
};

const ComposantQuestion = ({ question }: ProprietesComposantQuestion) => {
  return (
    <>
      {question.type === "liste" ? (
        <ComposantQuestionListe question={question} />
      ) : (
        <ComposantQuestionSimple question={question} />
      )}
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

  useEffect(() => {
    entrepots
      .diagnostique()
      .lis(idDiagnostique)
      .then((diagnostique) => {
        envoie(diagnostiqueCharge(diagnostique));
      });
  }, [entrepots, idDiagnostique, envoie]);

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section>
          <div>
            {etatReferentiel.diagnostique?.referentiel?.contexte.questions.map(
              (question) => (
                <fieldset key={question.identifiant} id={question.identifiant}>
                  <label>{question.libelle}</label>
                  <br />
                  <ComposantQuestion question={question} />
                </fieldset>
              ),
            )}
          </div>
        </section>
      </form>
    </>
  );
};
