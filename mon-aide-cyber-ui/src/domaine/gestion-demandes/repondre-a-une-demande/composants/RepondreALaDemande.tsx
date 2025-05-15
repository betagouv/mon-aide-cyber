import HeroBloc from '../../../../composants/communs/HeroBloc.tsx';
import { TypographieH1 } from '../../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Button from '../../../../composants/atomes/Button/Button.tsx';
import { DemandePourPostuler } from '../EcranRepondreAUneDemande.tsx';

export const RepondreALaDemande = ({
  demandeAide,
  surReponse,
}: {
  demandeAide?: DemandePourPostuler;
  surReponse?: () => void;
}) => {
  return (
    <>
      <HeroBloc>
        <div className="hero-layout">
          <section>
            <TypographieH1>Demande d‘Aide</TypographieH1>
            <p>
              Postuler à une demande d’aide effectuée en ligne par une entité
            </p>
          </section>
        </div>
      </HeroBloc>
      <section className="contenu-principal fond-clair-mac">
        {!demandeAide ? (
          <div>Chargement...</div>
        ) : (
          <div className="section-blanche">
            <div className="description-demande-aide">
              <TypographieH4>Informations sur la demande d‘Aide</TypographieH4>
              <div className="informations">
                <p>
                  Date :{'  '}
                  <b>
                    {new Date(demandeAide.dateCreation).toLocaleDateString()}
                  </b>
                </p>
                <p>
                  Type d‘entité :{'  '}
                  <b>{demandeAide?.typeEntite}</b>
                </p>
                <p>
                  Territoire :{'  '}
                  <b>
                    {demandeAide?.departement.nom} (
                    {demandeAide?.departement.code})
                  </b>
                </p>
                <p>
                  Secteur d‘activité :{'  '}
                  <b>{demandeAide?.secteurActivite}</b>
                </p>
              </div>
            </div>
            <div className="actions-demande-aide">
              <Button type="button" variant="primary" onClick={surReponse}>
                Je souhaite réaliser ce diagnostic
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
