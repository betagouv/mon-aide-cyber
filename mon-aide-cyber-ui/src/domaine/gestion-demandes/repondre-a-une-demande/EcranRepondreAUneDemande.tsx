import './ecran-repondre-a-une-demande.scss';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Departement } from '../departement.ts';
import { RepondreALaDemande } from './composants/RepondreALaDemande.tsx';
import { ConfirmationReponseALaDemande } from './composants/ConfirmationReponseALaDemande.tsx';

export type DemandeAide = {
  dateCreation: string;
  departement: Departement;
  typeEntite: string;
  secteurActivite: string;
};
const recupereDemandeAide = (): DemandeAide => ({
  dateCreation: '29/03/1996 17:30',
  departement: {
    code: '33',
    nom: 'Gironde',
  },
  typeEntite: 'Entreprise privée',
  secteurActivite: 'Tertiaire',
});

type ProprietesEcransAvecToken = {
  token?: string;
};

export const EcranRepondreAUneDemande = ({
  token,
}: ProprietesEcransAvecToken) => {
  console.log('le token', token);

  const { data: demandeAide } = useQuery({
    enabled: !!token,
    queryKey: ['recuperer-demande-aide', token],
    queryFn: () => recupereDemandeAide(),
  });

  const { mutate, isSuccess } = useMutation({
    mutationKey: ['repondre-a-une-demande'],
    mutationFn: (__token: string) => {
      return Promise.resolve();
    },
  });

  const repondreALaDemande = () => {
    if (token) mutate(token);
  };

  if (isSuccess) {
    return (
      <main role="main" className="ecran-repondre-a-une-demande">
        <ConfirmationReponseALaDemande />
      </main>
    );
  }

  return (
    <main role="main" className="ecran-repondre-a-une-demande">
      <RepondreALaDemande
        demandeAide={demandeAide!}
        surReponsePositive={repondreALaDemande}
      />
    </main>
  );
};
