import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { Entrepots } from '../../../domaine/Entrepots';
import { RechercheDemandeAideComplete } from '../../../gestion-demandes/aide/DemandeAide';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';

export const executeRelanceMiseEnRelation = async (
  emailAide: string,
  configuration: {
    entrepots: Entrepots;
    adaptateurRelation: AdaptateurRelationsMAC;
  } = {
    entrepots: fabriqueEntrepots(),
    adaptateurRelation: new AdaptateurRelationsMAC(),
  }
) => {
  const demandeAide = (await configuration.entrepots
    .demandesAides()
    .rechercheParEmail(emailAide)) as RechercheDemandeAideComplete;

  const demandeAttribuee =
    await configuration.adaptateurRelation.demandeAttribuee(
      demandeAide.demandeAide.identifiant
    );

  await configuration.adaptateurRelation.retireLesRelations([
    {
      relation: 'demandeAttribuee',
      utilisateur: {
        type: 'aidant',
        identifiant: demandeAttribuee.utilisateur.identifiant,
      },
      objet: {
        type: 'demandeAide',
        identifiant: demandeAide.demandeAide.identifiant,
      },
    },
  ]);
};
