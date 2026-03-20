import { program } from 'commander';
import { lesAidesNonPourvues } from './aidesNonPourvues';
import { fabriqueEntrepots } from '../../../adaptateurs/fabriqueEntrepots';
import { AdaptateurRelationsMAC } from '../../../relation/AdaptateurRelationsMAC';

const command = program.description(
  'Obtenir la liste des demandes d’Aides non pourvues'
);

command.action(async () => {
  console.log('Obtention des aides non pourvues démarrée');

  const aidesNonPourvues = await lesAidesNonPourvues(
    fabriqueEntrepots(),
    new AdaptateurRelationsMAC()
  ).recherche();

  console.log(JSON.stringify(aidesNonPourvues, undefined, 2));
});
