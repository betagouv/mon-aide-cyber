import { useEffect, useState } from 'react';
import { Lien, ReponseHATEOAS } from '../../../domaine/Lien.ts';
import { useMACAPI, useNavigationMAC } from '../../../fournisseurs/hooks.ts';
import { MoteurDeLiens } from '../../../domaine/MoteurDeLiens.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { ComposantDiagnostics } from './ComposantDiagnostics.tsx';
import { HeaderEspaceAidant } from '../HeaderEspaceAidant.tsx';
import { FooterEspaceAidant } from '../FooterEspaceAidant.tsx';
import { UUID } from '../../../types/Types.ts';

export type Diagnostic = {
  dateCreation: string;
  identifiant: UUID;
  secteurActivite: string;
  secteurGeographique: string;
};
export type ReponseTableauDeBord = ReponseHATEOAS & {
  diagnostics: Diagnostic[];
};

export const TableauDeBord = () => {
  // const [nomPrenom, setNomPrenom] = useState<string>('');
  // const authentification = useAuthentification();
  const [enCoursDeChargement, setEnCoursDeChargement] = useState(true);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const navigationMAC = useNavigationMAC();
  const macAPI = useMACAPI();

  // useEffect(() => {
  //   setNomPrenom(authentification.utilisateur?.nomPrenom || '');
  // }, [authentification, setNomPrenom]);

  useEffect(() => {
    new MoteurDeLiens(navigationMAC.etat).trouve(
      'afficher-tableau-de-bord',
      (lien: Lien) => {
        if (enCoursDeChargement) {
          macAPI
            .appelle<ReponseTableauDeBord>(
              constructeurParametresAPI()
                .url(lien.url)
                .methode(lien.methode!)
                .construis(),
              (reponse) => reponse
            )
            .then((tableauDeBord) => {
              navigationMAC.ajouteEtat(tableauDeBord.liens);
              setEnCoursDeChargement(false);
              setDiagnostics(tableauDeBord.diagnostics);
            })
            .catch((erreur: ReponseHATEOAS) => {
              console.log(erreur);
            });
        }
      }
    );
  }, [enCoursDeChargement, macAPI, navigationMAC]);

  return (
    <>
      <HeaderEspaceAidant />
      <main role="main" className="tableau-de-bord">
        <ComposantDiagnostics diagnostics={diagnostics} />
      </main>
      <FooterEspaceAidant />
    </>
  );
};
