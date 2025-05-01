import { program } from 'commander';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { BusCommandeMAC } from '../../../infrastructure/bus/BusCommandeMAC';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import {
  CommandeEnvoiMailCreationCompteAidant,
  DemandeFinalisationDevenirAidantEnvoyee,
} from '../../../gestion-demandes/devenir-aidant/CapteurCommandeEnvoiMailCreationCompteAidant';
import { AdaptateurReferentielMAC } from '../../../infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { AdaptateurMesures } from '../../../infrastructure/adaptateurs/AdaptateurMesures';
import { unServiceAidant } from '../../../espace-aidant/ServiceAidantMAC';
import { adaptateurRechercheEntreprise } from '../../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTP } from '../../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

const command = program
  .description('Envoi un mail de création de compte à l’Aidant')
  .argument('<mailAidant>', 'L’email de l’Aidant');

command.action(async (...args: any[]) => {
  const mailAidant = args[0].toLowerCase();

  const entrepots = fabriqueEntrepots();
  const busCommandeMAC = new BusCommandeMAC(
    entrepots,
    new BusEvenementMAC(
      fabriqueConsommateursEvenements(new AdaptateurRelationsMAC())
    ),
    fabriqueAdaptateurEnvoiMail(),
    {
      aidant: unServiceAidant(entrepots.aidants()),
      referentiels: {
        diagnostic: new AdaptateurReferentielMAC(),
        mesures: new AdaptateurMesures(),
      },
    },
    adaptateurRechercheEntreprise(new AdaptateurDeRequeteHTTP())
  );

  try {
    const demande = await busCommandeMAC.publie<
      CommandeEnvoiMailCreationCompteAidant,
      DemandeFinalisationDevenirAidantEnvoyee
    >({ type: 'CommandeEnvoiMailCreationCompteAidant', mail: mailAidant });
    console.log(
      'Email envoyé à : %s (demande n° : %s)',
      mailAidant,
      demande.identifiantDemande
    );
  } catch (erreur) {
    console.error('Erreur', erreur);
  }

  process.exit(0);
});

program.parse();
