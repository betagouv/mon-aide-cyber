import { ROUTE_MON_ESPACE } from '../../../../domaine/MoteurDeLiens';
import { useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useMoteurDeLiens } from '../../../../hooks/useMoteurDeLiens';
import { TypographieH6 } from '../../../communs/typographie/TypographieH6/TypographieH6';
import { MenuNavigation } from './menu-navigation/MenuNavigation';

export const Separateur = () => {
  return <div className="separateur"></div>;
};

export const Sidebar = () => {
  const { accedeALaRessource: peutAfficherTableauDeBord } = useMoteurDeLiens(
    'afficher-tableau-de-bord'
  );

  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );

  return (
    <aside className="barre-navigation-laterale mode-fonce">
      <div className="barre-navigation-laterale-sticky">
        <TypographieH6>Mon espace Aidant</TypographieH6>
        <Separateur />
        <section>
          <MenuNavigation
            elements={[
              ...(peutAfficherTableauDeBord
                ? [
                    {
                      nom: 'Mes diagnostics',
                      route: `${ROUTE_MON_ESPACE}/tableau-de-bord`,
                      actif: true,
                      enfants: [
                        /* {
                          nom: 'Mes demandes',
                          route: '/aidant/mes-demandes',
                          actif: false,
                        },
                        {
                          nom: 'Mes diagnostics',
                          route: '/aidant/tableau-de-bord',
                          actif: true,
                        },
                        {
                          nom: 'Mes tests',
                          route: '/aidant/mes-tests',
                          actif: false,
                        }, */
                      ],
                    },
                  ]
                : []),
            ]}
          />
        </section>
        <section>
          <MenuNavigation
            elements={[
              {
                nom: 'Mon compte',
                route: `${ROUTE_MON_ESPACE}/mes-informations`,
                actif: true,
                enfants: [
                  ...(estFonctionaliteActive
                    ? [
                        {
                          nom: 'Mes informations',
                          route: `${ROUTE_MON_ESPACE}/mes-informations`,
                          actif: true,
                        },
                        {
                          nom: 'Mes préférences',
                          route: `${ROUTE_MON_ESPACE}/mes-preferences`,
                          actif: true,
                        },
                      ]
                    : []),
                ],
              },
            ]}
          />
        </section>
      </div>
    </aside>
  );
};
