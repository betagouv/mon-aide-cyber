import { TypographieH1 } from '../../../composants/communs/typographie/TypographieH1/TypographieH1.tsx';
import HeroBloc from '../../../composants/communs/HeroBloc.tsx';
import './ecran-repondre-a-une-demande.scss';
import { TypographieH4 } from '../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import { useQuery } from '@tanstack/react-query';
import { Departement } from '../departement.ts';
import Button from '../../../composants/atomes/Button/Button.tsx';

type DemandeAide = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};
const recupereDemandeAide = (): DemandeAide => ({
  dateCreation: '29/03/1996 17:30',
  departement: {
    code: '33',
    nom: 'Gironde',
  },
  typeEntite: 'Entreprise privée',
  secteurActivite: 'Tertiaire',
});

type ProprietesEcransAvecToken = {
  token?: string;
};

export const EcranRepondreAUneDemande = ({
  token,
}: ProprietesEcransAvecToken) => {
  console.log('le token', token);

  const { data: demandeAide } = useQuery({
    queryKey: ['recuperer-demande-aide'],
    queryFn: () => recupereDemandeAide(),
  });

  const repondreALaDemande = () => {
    console.log('il a répondu');
  };

  return (
    <main role="main" className="ecran-repondre-a-une-demande">
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
        <div className="section-blanche">
          <div className="description-demande-aide">
            <TypographieH4>Informations sur la demande d‘Aide</TypographieH4>
            <div className="informations">
              <p>
                Date :{'  '}
                <b>{demandeAide?.dateCreation}</b>
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
            <Button
              type="button"
              variant="primary"
              onClick={repondreALaDemande}
            >
              Je souhaite réaliser ce diagnostic
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
