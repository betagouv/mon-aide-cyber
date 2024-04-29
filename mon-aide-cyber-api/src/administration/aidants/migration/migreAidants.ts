import { ServiceDeChiffrement } from '../../../securite/ServiceDeChiffrement';
import { UUID } from 'mon-aide-cyber-ui/src/types/Types';
import { EntrepotAidant } from '../../../authentification/Aidant';

export type MigrationAidant = {
  identifiant: UUID;
  aidant: {
    identifiantConnexion: string;
    nomPrenom: string;
    motDePasse: string;
    dateSignatureCGU?: string;
  };
};

type AidantDTO = {
  identifiant: UUID;
  identifiantConnexion: string;
  nomPrenom: string;
  motDePasse: string;
  dateSignatureCGU?: Date;
};

type AidantsMigres = {
  migres: number;
  total: number;
  erreurs?: string[];
};

export const migreAidants = async (
  entrepot: EntrepotAidant,
  serviceChiffrementOrigine: ServiceDeChiffrement,
  migration: MigrationAidant[],
): Promise<AidantsMigres> => {
  const erreurs: string[] = [];
  const aidantsDejaExistants: string[] = [];
  const migrations = Promise.all(
    migration
      .map((migration) => {
        try {
          return {
            identifiant: migration.identifiant,
            identifiantConnexion: serviceChiffrementOrigine.dechiffre(
              migration.aidant.identifiantConnexion,
            ),
            nomPrenom: serviceChiffrementOrigine.dechiffre(
              migration.aidant.nomPrenom,
            ),
            motDePasse: serviceChiffrementOrigine.dechiffre(
              migration.aidant.motDePasse,
            ),
            ...(migration.aidant.dateSignatureCGU && {
              dateSignatureCGU: new Date(
                Date.parse(migration.aidant.dateSignatureCGU),
              ),
            }),
          } as AidantDTO;
        } catch (erreur) {
          console.log('Erreur étape déchiffrement', erreur);
          erreurs.push(migration.identifiant);
          return undefined;
        }
      })
      .filter((aidant): aidant is AidantDTO => !!aidant)
      .map(async (aidant) => {
        return entrepot
          .rechercheParIdentifiantDeConnexion(aidant.identifiantConnexion)
          .then((aidant) =>
            aidantsDejaExistants.push(aidant.identifiantConnexion),
          )
          .catch(async () => {
            try {
              await entrepot.persiste({
                nomPrenom: aidant.nomPrenom,
                motDePasse: aidant.motDePasse,
                identifiantConnexion: aidant.identifiantConnexion,
                identifiant: aidant.identifiant,
                ...(aidant.dateSignatureCGU && {
                  dateSignatureCGU: aidant.dateSignatureCGU,
                }),
              });
              return 'OK';
            } catch (erreur) {
              console.log('Erreur étape persistance', erreur);
              erreurs.push(aidant.identifiant);
              return undefined;
            }
          });
      }),
  );
  return migrations.then((migrations) => {
    const migrationsEnSucces = migrations.filter(
      (resultat): resultat is 'OK' => !!resultat && resultat === 'OK',
    );
    return {
      migres: migrationsEnSucces.length,
      total: migration.length,
      ...(erreurs.length > 0 && { erreurs }),
      ...(aidantsDejaExistants.length > 0 && { aidantsDejaExistants }),
    };
  });
};
