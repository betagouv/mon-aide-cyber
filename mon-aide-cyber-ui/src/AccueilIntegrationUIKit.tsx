import { useTitreDePage } from './hooks/useTitreDePage.ts';
import { liensMesServicesCyber } from './infrastructure/mes-services-cyber/liens.ts';
import { EncartDiagnosticCyber } from './composants/landing/EncartDiagnosticCyber.tsx';

export const AccueilIntegrationUIKit = () => {
  useTitreDePage('Accueil');

  const tuiles = [
    {
      titre: 'Un dispositif étatique',
      contenu:
        'MonAideCyber est proposé par l’Agence nationale de la sécurité des systèmes d’information.',
      illustration: {
        lien: '/images/icones/accompagnement-personnalise.svg',
        alt: 'Un diagnostic cyber',
      },
    },
    {
      titre: 'Une communauté de confiance',
      contenu:
        'Les Aidants cyber sont issus de la sphère publique ou sont membres d’associations œuvrant pour un numérique de confiance.',
      illustration: {
        lien: '/images/icones/diagnostic-cyber.svg',
        alt: 'Un accompagnement personnalisé',
      },
    },
    {
      titre: 'Au service de l’intérêt général',
      contenu:
        'Le diagnostic cyber aide les entités qui souhaitent se protéger contre les cyberattaques et passer à l’action.',
      illustration: {
        lien: '/images/icones/communaute-aidants.svg',
        alt: 'Communauté d‘Aidants cyber',
      },
    },
  ];

  const etapesMarelle = [
    {
      titre: 'Vérifier votre éligibilité',
      description:
        'Vous êtes éligible si vous travaillez au sein d’une entité publique ou êtes membre d’une association oeuvrant pour la confiance numérique et si votre démarche est non lucrative.',
      illustration: {
        lien: '/images/illustration-marelle-etape-1.svg',
        alt: 'Un Aidé faisant un diagnostic avec un Aidant cyber',
      },
    },
    {
      titre: 'Devenir Aidant cyber',
      description:
        'Participer à la formation gratuite "Devenir Aidant cyber" d’une demi-journée et accepter la Charte de l’Aidant.',
      lien: {
        href: '/charte-aidant',
        texte: "Consulter la Charte de l'Aidant cyber",
        target: '_blank',
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
        target: '_blank',
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
    <main role="main">
      <lab-anssi-brique-hero
        titre="MonAideCyber"
        soustitre="Passez à l’action et menons ensemble votre première démarche de
                cybersécurité grâce à notre communauté d’Aidants présente sur
                tout le territoire !"
        illustration={JSON.stringify({
          lien: '/images/illustration-dialogue-mac.svg',
          alt: "scène d'un aidant cyber et d'un aidé faisant un diagnostic",
        })}
        actiongauche={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/realiser-des-diagnostics-anssi',
        })}
        actiondroite={JSON.stringify({
          titre: 'Bénéficier d‘un diagnostic cyber',
          lien: liensMesServicesCyber().cyberDepartBrut,
        })}
      ></lab-anssi-brique-hero>

      <lab-anssi-carrousel-tuiles
        tuiles={JSON.stringify(tuiles)}
      ></lab-anssi-carrousel-tuiles>

      <lab-anssi-titre-multimedia
        titre="Découvrez MonAideCyber en vidéo"
        multimedia={JSON.stringify({
          source:
            'https://ressources-mac.cellar-c2.services.clever-cloud.com/Video_MAC.mp4',
        })}
      ></lab-anssi-titre-multimedia>

      <EncartDiagnosticCyber />

      <lab-anssi-marelle
        titre="Comment réaliser des diagnostics cyber ?"
        etapesmarelle={JSON.stringify(etapesMarelle)}
        action={JSON.stringify({
          titre: 'Devenir Aidant cyber',
          lien: '/realiser-des-diagnostics-anssi#formulaire-formation',
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
          "Participer activem ent au développement du diagnostic cyber en nous partageant vos besoins et suggesions d'amélioration.",
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
    </main>
  );
};
