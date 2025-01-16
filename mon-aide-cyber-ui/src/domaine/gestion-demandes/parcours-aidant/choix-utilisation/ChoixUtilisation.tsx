import { TypographieH3 } from '../../../../composants/communs/typographie/TypographieH3/TypographieH3.tsx';
import illustrationInteretGeneralMAC from '../../../../../public/images/illustration-interet-general-mac.svg';
import illustrationCadreProfessionnelMAC from '../../../../../public/images/illustration-cadre-professionnel-mac.svg';
import { useEffect, useState } from 'react';
import { Choix } from './choix/Choix.tsx';
import useDefilementFluide from '../../../../hooks/useDefilementFluide.ts';
import { TypographieH5 } from '../../../../composants/communs/typographie/TypographieH5/TypographieH5.tsx';

export type Utilisation = 'InteretGeneral' | 'ActiviteProfessionnelle';

export const ChoixUtilisation = ({
  surClick,
}: {
  surClick: (choix: Utilisation) => void;
}) => {
  useDefilementFluide();
  const [choix, setChoix] = useState<Utilisation | undefined>(undefined);

  useEffect(() => {
    if (!choix) return;
    document
      .getElementById('etape-suivante-bouton')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, [choix]);

  return (
    <>
      <div className="choix-utilisation text-center">
        <TypographieH3 className="violet-fonce">
          Quelle utilisation du service envisagez-vous ?
        </TypographieH3>
        <span>Sélectionnez l&apos;usage qui vous correspond.</span>
      </div>

      <div className="formulaire-colonne-gauche">
        <Choix
          className="carte-choix-utilisation "
          name="choix-utilisation-service"
          surSelection={() => setChoix('ActiviteProfessionnelle')}
        >
          <div className="texte-centre">
            <img
              src={illustrationCadreProfessionnelMAC}
              alt="Illustration d’une personne travaillant dans le cadre professionnel."
            />
          </div>
          <div>
            <TypographieH5>
              Je souhaite utiliser librement l’outil de diagnostic de l’ANSSI
            </TypographieH5>
          </div>
          <div className="checklist">
            <div className="item">
              <div className="vert">
                <i className="fr-icon-check-line"></i>
              </div>
              <div>
                Je peux m’appuyer sur MonAideCyber à des fins lucratives
              </div>
            </div>
            <div className="item">
              <div className="rouge">
                <i className="fr-icon-close-line"></i>
              </div>
              <div>Je ne suis pas référencé en tant qu’”Aidant cyber”</div>
            </div>
          </div>
          <div className="mac-callout mac-callout-information">
            <i className="fr-icon-user-fill" />
            <div>Accessible à tous</div>
          </div>
        </Choix>
      </div>
      <div className="formulaire-colonne-droite">
        <Choix
          className="carte-choix-utilisation formulaire-colonne-droite"
          name="choix-utilisation-service"
          surSelection={() => setChoix('InteretGeneral')}
        >
          <div className="texte-centre">
            <img
              src={illustrationInteretGeneralMAC}
              alt="Illustration d’une personne oeuvrant pour l’intérêt général."
            />
          </div>
          <div>
            <TypographieH5>
              Je souhaite utiliser l’outil de diagnostic de l’ANSSI et être
              référencé Aidant cyber
            </TypographieH5>
          </div>
          <div className="checklist">
            <div className="item">
              <div className="vert">
                <i className="fr-icon-check-line"></i>
              </div>
              <div>Je suis référencé Aidant cyber</div>
            </div>
            <div className="item">
              <div className="rouge">
                <i className="fr-icon-close-line"></i>
              </div>
              <div>
                Je ne peux pas utiliser MonAideCyber à des fins lucratives
              </div>
            </div>
          </div>
          <div className="mac-callout mac-callout-information">
            <i className="fr-icon-user-fill" />
            <div>
              <p>Accessible :</p>
              <ul>
                <li>aux agents publics</li>
                <li>
                  aux salariés ou adhérents d'un relais associatif ou qui
                  souhaitent le devenir
                </li>
              </ul>
            </div>
          </div>
        </Choix>
      </div>

      <div className="validation">
        <button
          id="etape-suivante-bouton"
          disabled={!choix}
          type="button"
          className="fr-btn bouton-mac bouton-mac-primaire"
          onClick={() => {
            if (choix) {
              surClick(choix);
            }
          }}
        >
          Je valide ma sélection
        </button>
      </div>
    </>
  );
};
