import { useRecupereContexteNavigation } from '../../../hooks/useRecupereContexteNavigation.ts';
import { useQuery } from '@tanstack/react-query';
import { useMoteurDeLiens } from '../../../hooks/useMoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { HeroRelaisAssociatifs } from './composants/HeroRelaisAssociatifs.tsx';
import './ecran-relais-associatifs.scss';
import {
  recupereTitreParType,
  SectionListeAssociationsParRegion,
} from './composants/SectionListeAssociations.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import Sidemenu from '../../../composants/communs/Sidemenu/Sidemenu.tsx';
import useDefilementFluide from '../../../hooks/useDefilementFluide.ts';
import { useEffect } from 'react';
import IconeInformation from '../../../composants/communs/IconeInformation.tsx';
import { LienMailtoMAC } from '../../../composants/atomes/LienMailtoMAC.tsx';

export type Association = {
  nom: string;
  urlSite: string;
};

export type RegionEtSesAssociations = {
  nom: string;
  associations: Association[];
};

export type AssociationsParRegion = {
  [cle: string]: RegionEtSesAssociations;
};

type ReferentielAssociations = {
  national?: Association[];
  regional?: AssociationsParRegion;
  dromCom?: AssociationsParRegion;
};

const activeSectionsObservesDansMenu = () => {
  const observateurDIntersection = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const lienDeSection = document.querySelector(
          `nav ul li a.${entry.target.id}`
        );

        if (!lienDeSection) {
          return;
        }

        if (entry.isIntersecting) {
          lienDeSection.setAttribute('aria-current', 'page');
        } else {
          lienDeSection.removeAttribute('aria-current');
        }
      });
    },
    {
      rootMargin: '-30% 0% -62% 0%',
    }
  );

  const titresRubriques = document.querySelectorAll(
    '.rubriques-relais section'
  );

  console.log(titresRubriques);

  titresRubriques.forEach((titreRubrique) =>
    observateurDIntersection.observe(titreRubrique)
  );

  return () =>
    titresRubriques.forEach((titreRubrique) =>
      observateurDIntersection.unobserve(titreRubrique)
    );
};

export const EcranRelaisAssociatifs = () => {
  const macAPI = useMACAPI();
  const contexteNavigation = useRecupereContexteNavigation(
    'afficher-associations'
  );
  const action = useMoteurDeLiens('afficher-associations');

  useDefilementFluide();

  const { data, isLoading } = useQuery({
    enabled:
      !!contexteNavigation.contexteRecuperee && action.accedeALaRessource,
    queryKey: ['afficher-associations'],
    queryFn: () => {
      return macAPI.execute<ReferentielAssociations, ReferentielAssociations>(
        constructeurParametresAPI()
          .url(action.ressource.url)
          .methode(action.ressource.methode!)
          .construis(),
        async (json) => {
          return await json;
        }
      );
    },
  });

  useEffect(() => activeSectionsObservesDansMenu(), []);

  if (contexteNavigation.estEnCoursDeChargement || isLoading)
    return <div>Deux secondes...</div>;

  if (!data) return <div>Pas de résultats</div>;

  return (
    <main role="main" className="ecran-associations">
      <HeroRelaisAssociatifs />
      <section className="fond-clair-mac">
        <div className="fr-container">
          <div className="fr-grid-row">
            <Sidemenu
              sticky={true}
              className="fr-col-12 fr-col-lg-3"
              aria-labelledby="fr-sidemenu-title"
            >
              <>
                <Sidemenu.Link to="#proposerRelais" anchorId="proposerRelais">
                  Proposer un relais associatif
                </Sidemenu.Link>
                {Object.keys(data)?.map((clef) => (
                  <Sidemenu.Link key={clef} to={`#${clef}`} anchorId={clef}>
                    {recupereTitreParType(clef)}
                  </Sidemenu.Link>
                ))}
              </>
            </Sidemenu>
            <div className="fr-col-12 fr-col-lg-9 rubriques-relais">
              <div className="section" id="proposerRelais">
                <TypographieH2>Proposer un relais associatif</TypographieH2>
                <div className="fr-mt-2w information-message">
                  <IconeInformation />
                  <p>
                    Vous ne trouvez pas l’association à laquelle vous adhérez ou
                    vous souhaitez proposer un partenariat ? <br />
                    Les associations partenaires partagent avec MonAideCyber
                    l’engagement en faveur d’un monde numérique plus
                    responsable. Si vous souhaitez proposer un partenariat,
                    contactez-nous afin que nous étudions votre demande :{' '}
                    <LienMailtoMAC />
                  </p>
                </div>
              </div>
              <div className="section" id="national">
                <TypographieH2>
                  Relais associatifs à portée nationale
                </TypographieH2>
                <br />
                <ul>
                  {data?.national?.map((association) => (
                    <li key={association.nom}>
                      <span>{association.nom}</span> <br />
                      <a
                        href={association.urlSite}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {association.urlSite}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {data?.regional ? (
                <SectionListeAssociationsParRegion
                  code="regional"
                  associationsParRegion={data?.regional}
                />
              ) : null}
              {data?.dromCom ? (
                <SectionListeAssociationsParRegion
                  code="dromCom"
                  associationsParRegion={data?.dromCom}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
