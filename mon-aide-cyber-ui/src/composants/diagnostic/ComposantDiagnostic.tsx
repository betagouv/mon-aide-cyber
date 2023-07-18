import { PropsWithChildren, useContext, useEffect, useReducer } from "react";
import { useErrorBoundary } from "react-error-boundary";
import {
  Question,
  ReponseComplementaire,
  ReponsePossible,
} from "../../domaine/diagnostic/Referentiel.ts";
import { UUID } from "../../types/Types.ts";
import {
  diagnosticCharge,
  reducteurDiagnostic,
} from "../../domaine/diagnostic/reducteurs.ts";
import { FournisseurEntrepots } from "../../fournisseurs/FournisseurEntrepot.ts";

type ProprietesComposantQuestion = {
  question: Question;
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
  reponsePossible: ReponsePossible;
  identifiantQuestion: string;
  typeDeSaisie: "radio" | "checkbox";
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
          />
        );
      })}
    </div>
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
            {reponse.question !== undefined ? (
              <ComposantQuestionTiroir question={reponse.question} />
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

  return (
    <>
      <form>
        <h2>Contexte</h2>
        <section className="question">
          <div>
            {etatReferentiel.diagnostic?.referentiel?.contexte.questions.map(
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
