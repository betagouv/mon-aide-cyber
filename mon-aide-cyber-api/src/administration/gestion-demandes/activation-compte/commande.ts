import { program } from 'commander';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { BusCommandeMAC } from '../../../infrastructure/bus/BusCommandeMAC';
import { BusEvenementMAC } from '../../../infrastructure/bus/BusEvenementMAC';
import { fabriqueConsommateursEvenements } from '../../../adaptateurs/fabriqueConsommateursEvenements';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';
import { fabriqueAdaptateurEnvoiMail } from '../../../infrastructure/adaptateurs/fabriqueAdaptateurEnvoiMail';
import {
  SagaActivationCompteAidant,
  ActivationCompteAidantFaite,
} from '../../../gestion-demandes/devenir-aidant/CapteurSagaActivationCompteAidant';
import { AdaptateurReferentielMAC } from '../../../infrastructure/adaptateurs/AdaptateurReferentielMAC';
import { AdaptateurMesures } from '../../../infrastructure/adaptateurs/AdaptateurMesures';
import { unServiceAidant } from '../../../espace-aidant/ServiceAidantMAC';
import { adaptateurRechercheEntreprise } from '../../../infrastructure/adaptateurs/adaptateurRechercheEntreprise';
import { AdaptateurDeRequeteHTTP } from '../../../infrastructure/adaptateurs/adaptateurDeRequeteHTTP';

const command = program
  .description('Active le compte de l’Aidant et envoie un mail de confirmation')
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
      SagaActivationCompteAidant,
      ActivationCompteAidantFaite
    >({ type: 'SagaActivationCompteAidant', mail: mailAidant });
    console.log(
      'Activation faite, email envoyé à : %s (demande n° : %s)',
      mailAidant,
      demande.identifiantDemande
    );
  } catch (erreur) {
    console.error('Erreur', erreur);
  }

  process.exit(0);
});

program.parse();
