import { useContext, useEffect, useState } from "react";
import {
  Question,
  Referentiel,
  ReponsePossible,
} from "../domaine/diagnostique/Referentiel.ts";
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
        name={reponsePossible.identifiant}
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
            question={question}
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
  const [referentiel, setReferentiel] = useState<Referentiel | undefined>(
    undefined,
  );

  const entrepots = useContext(FournisseurEntrepots);

  useEffect(() => {
    entrepots
      .diagnostique()
      .lis(idDiagnostique)
      .then((diagnostique) => setReferentiel(diagnostique.referentiel));
  }, [entrepots, idDiagnostique]);

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section>
          <div>
            {referentiel?.contexte.questions.map((question) => (
              <fieldset key={question.identifiant} id={question.identifiant}>
                <label>{question.libelle}</label>
                <br />
                <ComposantQuestion question={question} />
              </fieldset>
            ))}
          </div>
        </section>
      </form>
    </>
  );
};
