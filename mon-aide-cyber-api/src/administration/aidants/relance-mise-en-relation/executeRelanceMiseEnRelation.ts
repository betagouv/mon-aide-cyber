import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { Entrepots } from '../../../domaine/Entrepots';
import { RechercheDemandeAideComplete } from '../../../gestion-demandes/aide/DemandeAide';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { BusEvenement, Evenement } from '../../../domaine/BusEvenement';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import crypto from 'crypto';
import { FournisseurHorloge } from '../../../infrastructure/horloge/FournisseurHorloge';

export const executeRelanceMiseEnRelation = async (
  emailAide: string,
  configuration: {
    entrepots: Entrepots;
    adaptateurRelation: AdaptateurRelationsMAC;
    busEvenement: BusEvenement;
  } = {
    entrepots: fabriqueEntrepots(),
    adaptateurRelation: new AdaptateurRelationsMAC(),
    busEvenement: new BusEvenementMAC(
      fabriqueConsommateursEvenements(new AdaptateurRelationsMAC())
    ),
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

  await configuration.busEvenement.publie<AffectationAnnulee>({
    identifiant: crypto.randomUUID(),
    type: 'AFFECTATION_ANNULEE',
    date: FournisseurHorloge.maintenant(),
    corps: {
      identifiantDemande: demandeAide.demandeAide.identifiant,
      identifiantAidant: demandeAttribuee.utilisateur.identifiant,
    },
  });
};
export type AffectationAnnulee = Evenement<{
  identifiantDemande: string;
  identifiantAidant: string;
}>;
