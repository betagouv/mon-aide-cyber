import { HeroRelaisAssociatifs } from './composants/HeroRelaisAssociatifs.tsx';
import './ecran-relais-associatifs.scss';
import { recupereTitreParType } from './composants/SectionListeAssociations.tsx';
import { TypographieH2 } from '../../../composants/communs/typographie/TypographieH2/TypographieH2.tsx';
import Sidemenu from '../../../composants/communs/Sidemenu/Sidemenu.tsx';
import IconeInformation from '../../../composants/communs/IconeInformation.tsx';
import { LienMailtoMAC } from '../../../composants/atomes/LienMailtoMAC.tsx';
import { useTitreDePage } from '../../../hooks/useTitreDePage.ts';
import { useEcranRelaisAssociatifs } from './useEcranRelaisAssociatifs.ts';
import { SectionsDePageALister } from './composants/SectionsALister.tsx';

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

export type ReferentielAssociations = {
  national?: Association[];
  regional?: AssociationsParRegion;
  dromCom?: AssociationsParRegion;
};

export const EcranRelaisAssociatifs = () => {
  useTitreDePage('Relais Associatifs');
  const { referentiel, enCoursDeChargement } = useEcranRelaisAssociatifs();

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
                {referentiel
                  ? Object.keys(referentiel)?.map((clef) => (
                      <Sidemenu.Link key={clef} to={`#${clef}`} anchorId={clef}>
                        {recupereTitreParType(clef)}
                      </Sidemenu.Link>
                    ))
                  : null}
              </>
            </Sidemenu>
            <div className="fr-col-12 fr-col-lg-9 rubriques-relais">
              <section className="section" id="proposerRelais">
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
              </section>
              {enCoursDeChargement ? (
                <section>
                  <p>Chargement...</p>
                </section>
              ) : (
                <SectionsDePageALister referentiel={referentiel} />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
