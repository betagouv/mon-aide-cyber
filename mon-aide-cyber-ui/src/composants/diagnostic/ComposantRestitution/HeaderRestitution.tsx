import { useModale, useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { useNavigueVersModifierDiagnostic } from '../../../fournisseurs/ContexteNavigationMAC.tsx';
import {
  requeteTelechargementRestitution,
  useRestitution,
} from './useRestitution.ts';
import { useCallback } from 'react';
import Button from '../../atomes/Button/Button.tsx';
import { UUID } from '../../../types/Types.ts';
import { ROUTE_MON_ESPACE } from '../../../domaine/MoteurDeLiens.ts';
import { liensMesServicesCyber } from '../../../infrastructure/mes-services-cyber/liens.ts';

export const HeaderRestitution = ({
  idDiagnostic,
  typeDiagnostic,
}: {
  idDiagnostic: UUID;
  typeDiagnostic?: 'libre-acces';
}) => {
  const { affiche, ferme } = useModale();

  const { navigue } = useNavigueVersModifierDiagnostic(
    typeDiagnostic === 'libre-acces'
      ? '/diagnostic'
      : `${ROUTE_MON_ESPACE}/diagnostic`
  );
  const navigationMAC = useNavigationMAC();

  const { demanderRestitution, enAttenteRestitution } = useRestitution(
    requeteTelechargementRestitution(idDiagnostic, (blob) => {
      const fichier = URL.createObjectURL(blob);
      const lien = document.createElement('a');
      lien.href = fichier;
      lien.download = `restitution-${idDiagnostic}.pdf`;
      lien.click();
    })
  );

  const modifierLeDiagnostic = useCallback(() => {
    navigue(navigationMAC.etat['modifier-diagnostic']);
  }, [navigationMAC.etat]);

  const quitterDiagnostic = () => {
    affiche({
      titre: 'Quitter le diagnostic',
      corps: (
        <section>
          <p>
            Vous vous apprêtez à quitter le diagnostic en cours, votre
            progression sera perdue.
            <br />
            <br />
            Si vous préférez solliciter une aide pour répondre aux questions,
            vous pouvez{' '}
            <a
              href={liensMesServicesCyber().cyberDepartAvecTracking}
              target="_blank"
              rel="noreferrer"
            >
              faire une demande pour un diagnostic accompagné
            </a>
            .
          </p>
          <div className="fr-pt-4w">
            <Button
              type="button"
              variant="secondary"
              key="annule-acceder-a-la-restitution"
              className="fr-mr-2w"
              onClick={ferme}
            >
              Annuler
            </Button>
            <Button
              type="button"
              key="connexion-aidant"
              onClick={() => {
                if (typeDiagnostic === 'libre-acces') {
                  window.location.replace('/');
                } else {
                  window.location.replace(
                    `${ROUTE_MON_ESPACE}/tableau-de-bord`
                  );
                }
              }}
            >
              Quitter le diagnostic
            </Button>
          </div>
        </section>
      ),
    });
  };

  return (
    <header role="banner" className="fr-header diagnostic-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top"></div>
              <div className="fr-header__service">
                <img
                  className="fr-responsive-img logo-mac-diagnostic"
                  src="/images/logo_mac.svg"
                  alt="ANSSI"
                />
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <div className="header-restitution-actions">
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => demanderRestitution()}
                    disabled={enAttenteRestitution}
                  >
                    <i className="fr-icon-download-line" />
                    <span>Télécharger</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={modifierLeDiagnostic}
                  >
                    <i className="fr-icon-pencil-line" />
                    <span>Modifier le diagnostic</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={quitterDiagnostic}
                  >
                    <span>Quitter</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
