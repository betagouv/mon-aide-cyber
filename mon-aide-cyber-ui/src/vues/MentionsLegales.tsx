import { Header } from '../composants/Header.tsx';
import { Footer } from '../composants/Footer.tsx';

export const MentionsLegales = () => {
  return (
    <>
      <Header />
      <main role="main">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-8" id="top">
              <h1>Mentions légales</h1>
              <h3>Éditeur</h3>
              <p>
                Le site est édité par l&apos;agence nationale de la sécurité des systèmes d&apos;information (ANSSI) :
                <br />
                51 boulevard de la Tour-Maubourg
                <br />
                75700 Paris 07 SP
                <br />
                France
                <br />
                lab-inno [at] ssi.gouv.fr.
              </p>
              <h3>Directeur de la publication</h3>
              <p>
                Vincent Strubel, directeur général de l&apos;ANSSI. La conception éditoriale, le suivi et les mises à
                jour du site internet sont assurés par les services de l&apos;ANSSI.
              </p>
              <h3>Hébergement</h3>
              <p>
                L&apos;hébergement du site est assuré par 3DS OUTSCALE SecNumCloud et SCALINGO, 15 avenue du Rhin, 67100
                Strasbourg, société par actions simplifiée, immatriculée au RCS de Strasbourg sous le numéro 808 665
                483.
              </p>
              <p>
                Toute correspondance à leur attention doit être adressée à l&apos;adresse suivante :
                support@scalingo.com.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};
