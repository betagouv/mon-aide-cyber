import { program } from 'commander';
import * as fs from 'fs';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';
import { AdaptateurRelationsMAC } from '../../relation/AdaptateurRelationsMAC';
import { AdaptateurRelations } from '../../relation/AdaptateurRelations';
import crypto from 'crypto';
import { lieDiagnostic, Relation } from '../lie-diagnostic/lieDiagnostic';
import { fabriqueEntrepotRelations } from '../../relation/infrastructure/fabriqueEntrepotRelations';
import { EntrepotDiagnostic } from '../../diagnostic/Diagnostic';
import { fabriqueEntrepots } from '../../adaptateurs/fabriqueEntrepots';
import { EntrepotAidant } from '../../authentification/Aidant';

const command = program
  .description('Lie des diagnostics à aidants')
  .argument(
    '<cheminFichier>',
    'le chemin du fichier contenant les diagnotics à rattacher (au format csv, séparation avec ";")'
  );

const lieDiagnostics = async (
  adaptateurRelations: AdaptateurRelations,
  entrepotDiagnostic: EntrepotDiagnostic,
  entrepotAidant: EntrepotAidant,
  relations: Relation[]
): Promise<Relation[]> => {
  return Promise.all(
    relations.map(
      async (diagnostic) =>
        await lieDiagnostic(
          adaptateurRelations,
          entrepotDiagnostic,
          entrepotAidant,
          diagnostic
        )
    )
  );
};

const transcris = (lignes: string): Relation[] =>
  lignes
    .split('\n')
    .slice(1)
    .map((ligne): Relation => {
      const champs = ligne.split(';');

      return {
        mailAidant: champs[0] as crypto.UUID,
        identifiantAidant: champs[1] as crypto.UUID,
        identifiantDiagnostic: champs[2] as crypto.UUID,
        estPersiste: false,
      };
    });

command.action(async (...args: any[]) => {
  const relations = transcris(fs.readFileSync(args[0], { encoding: 'utf-8' }));

  const resultats = await lieDiagnostics(
    new AdaptateurRelationsMAC(fabriqueEntrepotRelations()),
    fabriqueEntrepots().diagnostic(),
    fabriqueEntrepots().aidants(),
    relations
  );

  if (resultats) {
    const rapport: string[] = [];
    const dateMaintenantISO = FournisseurHorloge.maintenant().toISOString();
    rapport.push(
      `mailAidant;identifianAidant;identifiantDiagnostic;migré ?;commentaire\n`
    );

    resultats.forEach((resultat) => {
      const message = resultat.message ? resultat.message : '';

      rapport.push(
        `${resultat.mailAidant};${resultat.identifiantAidant};${
          resultat.identifiantDiagnostic
        };${resultat.estPersiste ? 'oui' : 'non'};${message}\n`
      );
    });

    fs.writeFileSync(
      `/tmp/rapport-migration-diagnostics-${dateMaintenantISO}.csv`,
      rapport.join(''),
      {
        encoding: 'utf-8',
      }
    );
  }
  process.exit(0);
});

program.parse();
