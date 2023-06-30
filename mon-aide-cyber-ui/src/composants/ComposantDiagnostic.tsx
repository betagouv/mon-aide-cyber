import { useContext, useEffect, useState } from "react";
import {
  Question,
  Referentiel,
  ReponsePossible,
} from "../domaine/diagnostic/Referentiel.ts";
import { FournisseurEntrepots } from "../fournisseurs/FournisseurEntrepot.ts";
import { UUID } from "../types/Types.ts";

type ProprietesComposantQuestion = {
  question: Question;
};

type ProprietesComposantReponsePossible = {
  reponsePossible: ReponsePossible;
  question: Question;
};

const ComposantReponsePossible = ({
  reponsePossible,
  question,
}: ProprietesComposantReponsePossible) => {
  const champsASaisir =
    reponsePossible.type === "aSaisir" ? (
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
        name={question.identifiant}
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
const ComposantQuestion = ({ question }: ProprietesComposantQuestion) => {
  return (
    <>
      <label>{question.libelle}</label>
      <br />
      {question.reponsesPossibles.map((reponse) => {
        return (
          <ComposantReponsePossible
            key={reponse.identifiant}
            reponsePossible={reponse}
            question={question}
          />
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
  const [referentiel, setReferentiel] = useState<Referentiel | undefined>(
    undefined,
  );

  const entrepots = useContext(FournisseurEntrepots);

  useEffect(() => {
    entrepots
      .diagnostic()
      .lis(idDiagnostic)
      .then((diagnostic) => setReferentiel(diagnostic.referentiel));
  }, [entrepots, idDiagnostic]);

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section>
          <div>
            {referentiel?.contexte.questions.map((question) => (
              <fieldset key={question.identifiant} id={question.identifiant}>
                <ComposantQuestion question={question} />
              </fieldset>
            ))}
          </div>
        </section>
      </form>
    </>
  );
};
