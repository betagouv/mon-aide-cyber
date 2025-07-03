import { useTitreDePage } from './hooks/useTitreDePage.ts';
import { liensMesServicesCyber } from './infrastructure/mes-services-cyber/liens.ts';
import { EncartDiagnosticCyber } from './composants/landing/EncartDiagnosticCyber.tsx';
import { EncartRealiserDesDiagnosticsCyber } from './composants/landing/EncartRealiserDesDiagnosticsCyber/EncartRealiserDesDiagnosticsCyber.tsx';
import { EncartLogosPartenaires } from './composants/landing/EncartLogosPartenaires/EncartLogosPartenaires.tsx';

export const Accueil = () => {
  useTitreDePage('Accueil');

  const tuiles = [
    {
      titre: 'Un dispositif étatique',
      contenu:
        'MonAideCyber est proposé par l’Agence nationale de la sécurité des systèmes d’information.',
      illustration: {
        lien: '/images/icones/dispositif-etatique.svg',
        alt: '',
      },
    },
    {
      titre: 'Une communauté de confiance',
      contenu:
        'Les Aidants cyber sont issus de la sphère publique ou sont membres d’associations œuvrant pour un numérique de confiance.',
      illustration: {
        lien: '/images/icones/communaute.svg',
        alt: '',
      },
    },
    {
      titre: 'Au service de l’intérêt général',
      contenu:
        'Le diagnostic cyber aide les entités qui souhaitent se protéger contre les cyberattaques et passer à l’action.',
      illustration: {
        lien: '/images/icones/interet-general.svg',
        alt: '',
      },
    },
  ];

  const etapesMarelle = [
    {
      titre: 'Vérifier votre éligibilité',
      description:
        'Vous êtes éligible si vous travaillez au sein d’une entité publique ou êtes membre d’une association œuvrant pour la confiance numérique et si votre démarche est non lucrative.',
      illustration: {
        lien: '/images/illustration-marelle-etape-1.svg',
        alt: '',
      },
    },
    {
      titre: 'Devenir Aidant cyber',
      description:
        'Participer à la formation gratuite "Devenir Aidant cyber" d’une demi-journée et accepter la Charte de l’Aidant.',
      lien: {
        href: '/charte-aidant',
        texte: "Consulter la Charte de l'Aidant cyber",
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-2.svg',
        alt: '',
      },
    },
    {
      titre: 'Rejoindre la communauté des Aidants cyber',
      description: 'Echangez avec tous les les Aidants cyber sur Tchap !',
      lien: {
        href: 'https://tally.so/r/3EYlq2',
        texte: 'Rejoindre la communauté',
        target: '_blank',
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-3.svg',
        alt: '',
      },
    },
    {
      titre: 'Réaliser des diagnostics cyber !',
      description:
        'Répondez aux sollicitations de demandes de diagnostics cyber et faîtes la promotion du dispositif autour de vous !',
      lien: {
        href: '/promouvoir-diagnostic-cyber',
        texte: 'Accéder au kit de communication',
      },
      illustration: {
        lien: '/images/illustration-marelle-etape-4.svg',
        alt: '',
      },
    },
  ];

  const temoignages = [
    {
      auteur: 'Matthieu D.',
      citation:
        'Encore merci pour cet outil qui, une fois la communauté d’aidants réunionnaise structurée et formée, nous aidera grandement dans le passage à l’échelle.',
      source: 'Un utilisateur de La Réunion (974)',
    },
    {
      auteur: 'Didier L.',
      citation:
        'MonAideCyber remplit très bien sa mission, et le fait de pouvoir tout de suite donner un rapport aux interlocuteurs est un réel atout.',
      source: 'Un Aidant cyber, réserviste de la Police, dans le Rhône (69)',
    },
  ];

  return (
    <main role="main" className="page-accueil">
      <lab-anssi-brique-hero
        titre="Mon​Aide​Cyber"
        soustitre="Des Aidants cyber mobilisés pour aider les entités publiques et privées à prendre leur cyberdépart !"
        illustration={JSON.stringify({
          lien: '/images/illustration-dialogue-mac.svg',
          alt: '',
        })}
        actiongauche={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/inscription',
        })}
        actiondroite={JSON.stringify({
          titre: 'Bénéficier d‘un diagnostic cyber',
          lien: liensMesServicesCyber().cyberDepartAvecTracking,
          target: '_blank',
        })}
      ></lab-anssi-brique-hero>

      <lab-anssi-carrousel-tuiles
        tuiles={JSON.stringify(tuiles)}
      ></lab-anssi-carrousel-tuiles>

      <EncartDiagnosticCyber />

      <lab-anssi-titre-multimedia
        titre="Découvrez MonAideCyber en vidéo"
        multimedia={JSON.stringify({
          imagedecouverture:
            '/images/video-presentation-mac/apercu-video-mon-aide-cyber.jpg',
          source:
            'https://ressources-mac.cellar-c2.services.clever-cloud.com/MAC_video_devenir-aidants_avec_st.mp4',
        })}
      ></lab-anssi-titre-multimedia>

      <lab-anssi-marelle
        titre="Comment réaliser des diagnostics cyber ?"
        etapesmarelle={JSON.stringify(etapesMarelle)}
        action={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/inscription',
        })}
      ></lab-anssi-marelle>

      <lab-anssi-temoignages
        titre="Les témoignages de nos Aidants cyber"
        temoignages={JSON.stringify(temoignages)}
      ></lab-anssi-temoignages>

      <lab-anssi-brique-rejoindre-la-communaute
        titre="Rejoignez la communauté des Aidants cyber !"
        raisons={JSON.stringify([
          'Échanger directement avec les autres Aidants cyber.',
          "Participer activement au développement du diagnostic cyber en nous partageant vos besoins et suggesions d'amélioration.",
        ])}
        illustration={JSON.stringify({
          lien: '/images/illustration-deux-personnes.svg',
          alt: '',
        })}
        action={JSON.stringify({
          titre: 'Rejoindre la communauté',
          lien: 'https://tally.so/r/3EYlq2',
        })}
      ></lab-anssi-brique-rejoindre-la-communaute>

      <EncartRealiserDesDiagnosticsCyber />

      <EncartLogosPartenaires />

      <lab-anssi-presentation-anssi></lab-anssi-presentation-anssi>
    </main>
  );
};
