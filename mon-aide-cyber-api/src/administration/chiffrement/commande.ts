import { program } from 'commander';
import { adaptateurServiceChiffrement } from '../../infrastructure/adaptateurs/adaptateurServiceChiffrement';

program
  .option(
    '-c, --chiffre <chaineAChiffrer>',
    'chiffre la chaine passée en paramètre'
  )
  .option(
    '-d, --dechiffre <chaineADechiffrer>',
    'déchiffre la chaine passée en paramètre'
  )
  .parse(process.argv);

const options = program.opts();

if (options.chiffre) {
  console.log(adaptateurServiceChiffrement().chiffre(options.chiffre));
}

if (options.dechiffre) {
  console.log(adaptateurServiceChiffrement().dechiffre(options.dechiffre));
}
