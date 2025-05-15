import './ecran-repondre-a-une-demande.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Departement } from '../departement.ts';
import { RepondreALaDemande } from './composants/RepondreALaDemande.tsx';
import { ConfirmationReponseALaDemande } from './composants/ConfirmationReponseALaDemande.tsx';
import { useMACAPI } from '../../../fournisseurs/api/useMACAPI.ts';
import { constructeurParametresAPI } from '../../../fournisseurs/api/ConstructeurParametresAPI.ts';
import { DemandeDejaPourvue } from './composants/DemandeDejaPourvue.tsx';

type ProprietesEcransAvecToken = {
  token?: string;
};

export type DemandePourPostuler = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};

export const EcranRepondreAUneDemande = ({
  token,
}: ProprietesEcransAvecToken) => {
  const macAPI = useMACAPI();

  const { data: demandeAide } = useQuery<DemandePourPostuler>({
    enabled: !!token,
    queryKey: ['recuperer-demande-aide', token],
    queryFn: async () =>
      await macAPI.execute<DemandePourPostuler, DemandePourPostuler>(
        constructeurParametresAPI()
          .url('/api/aidant/repondre-a-une-demande/informations-de-demande')
          .methode('GET')
          .construis(),
        async (json) => await json
      ),
  });

  const repondreAUneDemande = useMutation({
    mutationKey: ['repondre-a-une-demande'],
    mutationFn: async (token: string) => {
      return await macAPI.execute<any, any, { token: string }>(
        constructeurParametresAPI<{ token: string }>()
          .url('/api/aidant/repondre-a-une-demande')
          .methode('POST')
          .corps({
            token,
          })
          .construis(),
        (reponse) => reponse
      );
    },
  });

  const repondreALaDemande = () => {
    if (token) repondreAUneDemande.mutate(token);
  };

  if (repondreAUneDemande.isSuccess) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <ConfirmationReponseALaDemande />
      </main>
    );
  }

  if (repondreAUneDemande.isError) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <DemandeDejaPourvue />
      </main>
    );
  }

  return (
    <main role="main" className="ecran-repondre-a-une-demande">
      <RepondreALaDemande
        demandeAide={demandeAide}
        surReponsePositive={repondreALaDemande}
      />
    </main>
  );
};
