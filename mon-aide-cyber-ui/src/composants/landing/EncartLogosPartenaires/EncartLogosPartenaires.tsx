import { TypographieH2 } from '../../communs/typographie/TypographieH2/TypographieH2.tsx';

export const EncartLogosPartenaires = () => {
  return (
    <section className="encart-logos">
      <div className="encart-titre-logos">
        <TypographieH2>Nos partenaires</TypographieH2>
        <div className="footer-logos">
          <a
            className="logo logo-comcybermi"
            href="https://www.interieur.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/logo_comcybermi.svg" alt="Logo de COMCYBER-MI" />
          </a>
          <a
            className="logo logo-gendarmerienationale"
            href="https://www.gendarmerie.interieur.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/logo_gendarmerie_nationale.svg"
              alt="Logo de la Gendarmerie Nationale"
            />
          </a>
          <a
            className="logo logo-cnil"
            href="https://www.cnil.fr"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/logo_cnil.svg"
              alt="Logo de la Commission Nationale de l’Informatique et des Libertés"
            />
          </a>
          <a
            className="logo logo-cybermalveillance"
            href="https://www.cybermalveillance.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/logo_acyma.svg" alt="Logo de CyberMalveillance" />
          </a>
          <a
            className="logo logo-policenationale"
            href="https://www.police-nationale.interieur.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/logo_police_nationale.svg"
              alt="Logo de la Police Nationale"
            />
          </a>
        </div>
      </div>
    </section>
  );
};
