import { Thematique } from '../../../api/representateurs/types';

export const transcripteurSecuriteInfrastructure: Thematique = {
  description:
    "La sécurité des infrastructures est vitale pour protéger systèmes, réseaux et informations contre les menaces numériques. Le pare-feu, le cryptage et la détection d'intrusions pour prévenir, détecter et limiter les attaques sont entre autres utilisés.",
  libelle: 'Sécurité des infrastructures',
  styles: {
    navigation: 'navigation-securite-infrastructure',
  },
  localisationIllustration:
    '/images/diagnostic/securite-infrastructures/illustration.svg',
  groupes: [
    {
      questions: [
        {
          identifiant: 'securite-infrastructure-pare-feu-deploye',
          'info-bulles': ['infrastructures/pare-feu-deploye.pug'],
        },
        {
          identifiant: 'securite-infrastructure-si-industriel-pare-feu-deploye',
          perimetre: 'SYSTEME-INDUSTRIEL',
          'info-bulles': ['infrastructures/cloisonnement-si-industriels.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-equipements-securite-deployees',
          'info-bulles': ['infrastructures/maj-equipements-securite.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-mises-a-jour-fonctionnelles-securite-systemes-exploitation-securite-deployees',
          'info-bulles': [
            'infrastructures/maj-serveurs-services-administration.pug',
          ],
        },
      ],
    },
    {
      questions: [
        {
          identifiant:
            'securite-infrastructure-outils-securisation-systeme-messagerie',
          'info-bulles': ['infrastructures/securiser-messagerie.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-infrastructure-acces-wifi-securises',
          perimetre: 'ESPIONNAGE-CIBLE',
          'info-bulles': ['infrastructures/securiser-wifi.pug'],
        },
      ],
    },
    {
      questions: [
        {
          identifiant: 'securite-infrastructure-espace-stockage-serveurs',
          perimetre: 'ESPIONNAGE-CIBLE',
          'info-bulles': [
            'infrastructures/acces-serveurs.pug',
            'infrastructures/expert-surete-gendarmerie.pug',
          ],
        },
      ],
    },
  ],
};
