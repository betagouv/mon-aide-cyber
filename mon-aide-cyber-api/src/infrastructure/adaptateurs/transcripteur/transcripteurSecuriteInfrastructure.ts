import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSecuriteInfrastructure: Thematique = {
  description:
    "La sécurité des infrastructures et des données est vitale pour protéger systèmes, réseaux et informations contre les menaces numériques. Le pare-feu, le cryptage et la détection d'intrusions pour prévenir, détecter et limiter les attaques sont entre autres utilisés.",
  libelle: 'Sécurité des infrastructures',
  localisationIconeNavigation:
    '/images/diagnostic/securite-infrastructures/icone-navigation.svg',
  localisationIllustration:
    '/images/diagnostic/securite-infrastructures/illustration.svg',
  groupes: [
    {
      questions: [
        { identifiant: 'securite-infrastructure-pare-feu-deploye' },
        {
          identifiant: 'securite-infrastructure-si-industriel-pare-feu-deploye',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-infrastructure-acces-wifi-securises',
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-infrastructure-espace-stockage-serveurs',
        },
      ],
    },
  ],
};
