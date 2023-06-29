import { useEffect, useState } from "react";
import {
  Question,
  Referentiel,
  ReponsePossible,
} from "../domaine/diagnostic/Referentiel.ts";

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
      <label>{reponsePossible.libelle}</label>
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
            reponsePossible={reponse}
            question={question}
          />
        );
      })}
    </>
  );
};

export const ComposantDiagnostic = () => {
  const [referentiel, setReferentiel] = useState<Referentiel | undefined>(
    undefined,
  );

  useEffect(() => {
    setReferentiel({
      contexte: {
        questions: [
          {
            identifiant: "natureOrganisation",
            libelle: "Quelle est la nature de votre organisation ?",
            reponsesPossibles: [
              {
                identifiant: "organisationPublique",
                libelle:
                  "Organisation publique (ex. collectivité, organisation centrale)",
                ordre: 0,
              },
              {
                identifiant: "entreprisePrivee",
                libelle: "Entreprise privée (ex. TPE, PME, ETI)",
                ordre: 1,
              },
              {
                identifiant: "association",
                libelle: "Association (ex. association loi 1901)",
                ordre: 2,
              },
              {
                identifiant: "autre",
                libelle: "Autre : préciser",
                ordre: 3,
                type: "aSaisir",
              },
            ],
          },
        ],
      },
    });
  }, []);

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section>
          <div>
            {referentiel?.contexte.questions.map((question) => (
              <fieldset id={question.identifiant}>
                <ComposantQuestion question={question} />
              </fieldset>
            ))}
          </div>
        </section>
      </form>
    </>
  );
};
