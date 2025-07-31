import { TypographieH4 } from '../../../../composants/communs/typographie/TypographieH4/TypographieH4.tsx';

type ProprietesEncartContenu = {
  titre: string;
  paragraphe: string;
  video: {
    source: string;
    imageCouverture?: string;
    sousTitres: string;
  };
};

const EncartContenu = ({
  titre,
  paragraphe,
  video,
}: ProprietesEncartContenu) => {
  return (
    <div className="fr-grid-row">
      <div className="fr-col-xl-8 fr-col-lg-12">
        <div className="texte">
          <TypographieH4>{titre}</TypographieH4>
          <p>{paragraphe}</p>
        </div>
        <div className="video">
          <video
            controls
            src={video.source}
            crossOrigin="anonymous"
            poster={video.imageCouverture}
          >
            <source src={video.source} type="video/mp4" />
            <track
              default
              src={video.sousTitres}
              kind="captions"
              srcLang="fr"
              label="Français"
            />
            Votre navigateur ne supporte pas la fonctionnalité de lecture de
            vidéos.
          </video>
        </div>
      </div>
    </div>
  );
};
export default EncartContenu;
