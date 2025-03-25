import { TypographieH4 } from '../../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';
import Cadre from '../../../../../composants/promouvoir/Cadre.tsx';

export const SignaturesDeMails = () => {
  return (
    <div className="fr-col-md-8 fr-col-sm-12">
      <TypographieH4>Signature de mails</TypographieH4>
      <p>
        Les signatures de mail Aidants cyber contiennent un lien hypertexte
        renvoyant vers la page d‘accueil MonAideCyber
      </p>
      <Cadre>
        <img
          src="/images/kit-aidant/MAC_signature_mail_violet.png"
          alt="Signature mail de MonAideCyber en fond violet"
        />
      </Cadre>
      <br />
      <Cadre>
        <img
          src="/images/kit-aidant/macsignature-mailblanc.png"
          alt="Signature mail de MonAideCyber en fond blanc"
        />
      </Cadre>
      <br />
      <a href="/fichiers/MonAideCyber_signature_mail.zip" target="_blank">
        Télécharger tous les visuels
      </a>
    </div>
  );
};
