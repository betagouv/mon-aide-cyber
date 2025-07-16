import { ROUTE_MON_ESPACE } from '../../../../domaine/MoteurDeLiens';
import { useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useMoteurDeLiens } from '../../../../hooks/useMoteurDeLiens';
import { TypographieH6 } from '../../../communs/typographie/TypographieH6/TypographieH6';
import { MenuNavigation } from './menu-navigation/MenuNavigation';
import Button from '../../../atomes/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

export const Separateur = () => {
  return <div className="separateur"></div>;
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const { accedeALaRessource: peutAfficherTableauDeBord } = useMoteurDeLiens(
    'afficher-tableau-de-bord'
  );
  const { accedeALaRessource: peutAfficherLesPreferencesAidant } =
    useMoteurDeLiens('afficher-preferences');
  const { accedeALaRessource: peutDemanderADevenirAidant } = useMoteurDeLiens(
    'demande-devenir-aidant'
  );

  const { estFonctionaliteActive } = useFeatureFlag(
    'ESPACE_AIDANT_ECRAN_MES_PREFERENCES'
  );

  return (
    <aside className="barre-navigation-laterale mode-fonce">
      <div className="barre-navigation-laterale-sticky">
        <TypographieH6>Mon espace</TypographieH6>
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
                      enfants: [],
                    },
                  ]
                : []),
              ...(estFonctionaliteActive
                ? [
                    ...(peutAfficherLesPreferencesAidant
                      ? [
                          {
                            nom: 'Mes préférences',
                            route: `${ROUTE_MON_ESPACE}/mes-preferences`,
                            actif: true,
                          },
                        ]
                      : []),
                    {
                      nom: 'Mes informations',
                      route: `${ROUTE_MON_ESPACE}/mes-informations`,
                      actif: true,
                    },
                  ]
                : []),
            ]}
          />
        </section>

        {peutDemanderADevenirAidant ? (
          <section className="encart-cta-mon-espace-devenir-aidant">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/mon-espace/devenir-aidant')}
            >
              <span>Devenir Aidant cyber</span>
              <i className="fr-icon-award-fill"></i>
            </Button>
          </section>
        ) : null}
      </div>
    </aside>
  );
};
