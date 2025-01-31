import { SignatureCGU } from '../../../gestion-demandes/parcours-aidant/SignatureCGU.tsx';
import { useCallback } from 'react';
import { MoteurDeLiens, ROUTE_MON_ESPACE } from '../../../MoteurDeLiens.ts';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { constructeurParametresAPI } from '../../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { useNavigationMAC } from '../../../../fournisseurs/hooks.ts';
import { useMACAPI } from '../../../../fournisseurs/api/useMACAPI.ts';
import './valider-profil-utilisateur-inscrit.scss';
import { ReponseHATEOAS } from '../../../Lien.ts';

export type CorpsValiderProfilUtilisateurInscrit = {
  cguValidees: boolean;
};

export const EcranValiderProfilUtilisateurInscrit = () => {
  const navigationMAC = useNavigationMAC();
  const navigate = useNavigate();
  const macAPI = useMACAPI();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ['valide-profil-utilisateur-inscrit'],
    mutationFn: (corpsMutation: CorpsValiderProfilUtilisateurInscrit) => {
      const actionSoumettre = new MoteurDeLiens(
        navigationMAC.etat
      ).trouveEtRenvoie('valider-profil-utilisateur-inscrit');

      if (!actionSoumettre)
        throw new Error(
          'Une erreur est survenue lors de la demande devenir aidant'
        );

      return macAPI.execute<
        ReponseHATEOAS,
        ReponseHATEOAS,
        CorpsValiderProfilUtilisateurInscrit
      >(
        constructeurParametresAPI<CorpsValiderProfilUtilisateurInscrit>()
          .url(actionSoumettre.url)
          .methode(actionSoumettre.methode!)
          .corps(corpsMutation)
          .construis(),
        (corps) => corps
      );
    },
    onSuccess: (reponse) => {
      window.scrollTo({ top: 0 });
      queryClient.invalidateQueries({ queryKey: ['recupere-utilisateur'] });
      navigationMAC.navigue(
        ROUTE_MON_ESPACE + '/tableau-de-bord',
        reponse.liens
      );
    },
  });

  const surValidationCGU = useCallback(() => {
    mutate({ cguValidees: true });
  }, []);

  const retourAuChoixUtilisation = () => {
    navigate(`${ROUTE_MON_ESPACE}/mon-utilisation-du-service`);
  };
  return (
    <div className="fond-clair-mac w-100">
      <SignatureCGU
        valideCGUs={surValidationCGU}
        precedent={retourAuChoixUtilisation}
      />
    </div>
  );
};
