import { Aggregat, AggregatNonTrouve } from '../../../domaine/Aggregat';
import { EntrepotEcriture } from '../../../domaine/Entrepot';
import { Diagnostic, EntrepotDiagnostic } from '../../../diagnostic/Diagnostic';
import { cloneDeep } from 'lodash';
import crypto, { UUID } from 'crypto';

import {
  EntrepotEvenementJournal,
  Publication,
} from '../../../journalisation/Publication';
import {
  EntrepotRestitution,
  Restitution,
} from '../../../restitution/Restitution';
import {
  DemandeDevenirAidant,
  EntrepotDemandeDevenirAidant,
  StatutDemande,
} from '../../../gestion-demandes/devenir-aidant/DemandeDevenirAidant';
import {
  EntrepotStatistiques,
  Statistiques,
} from '../../../statistiques/statistiques';
import {
  Aidant as AnnuaireAidant,
  EntrepotAnnuaireAidants,
} from '../../../annuaire-aidants/annuaireAidants';
import { CriteresDeRecherche } from '../../../annuaire-aidants/ServiceAnnuaireAidants';
import {
  EntrepotUtilisateur,
  Utilisateur,
} from '../../../authentification/Utilisateur';
import {
  Aidant,
  EntrepotAidant,
  estSiretGendarmerie,
} from '../../../espace-aidant/Aidant';
import {
  EntrepotProfilAidant,
  ProfilAidant,
} from '../../../espace-aidant/profil/profilAidant';
import {
  DemandeDiagnosticLibreAcces,
  EntrepotDemandeDiagnosticLibreAcces,
} from '../../../diagnostic-libre-acces/CapteurSagaLanceDiagnosticLibreAcces';
import {
  EntrepotUtilisateursMAC,
  UtilisateurMAC,
} from '../../../recherche-utilisateurs-mac/rechercheUtilisateursMAC';
import { unServiceAidant } from '../../../espace-aidant/ServiceAidantMAC';
import {
  EntrepotUtilisateurInscrit,
  UtilisateurInscrit,
} from '../../../espace-utilisateur-inscrit/UtilisateurInscrit';
import { AidantDTO } from '../../../espace-aidant/ServiceAidant';
import {
  DemandeAide,
  DemandeAideSimple,
  EntrepotDemandeAide,
  EntrepotDemandeAideLecture,
  RechercheDemandeAide,
} from '../../../gestion-demandes/aide/DemandeAide';
import {
  EntrepotStatistiquesAidant,
  StatistiquesAidant,
} from '../../../statistiques/aidant/StastistiquesAidant';
import { EntrepotRelationMemoire } from '../../../relation/infrastructure/EntrepotRelationMemoire';
import { Tuple } from '../../../relation/Tuple';
import {
  EntrepotStatistiquesUtilisateurInscrit,
  StatistiquesUtilisateurInscrit,
} from '../../../statistiques/utilisateur-inscrit/StatistiquesUtilisateurInscrit';
import { Departement } from '../../../gestion-demandes/departements';
import { SecteurActivite } from '../../../espace-aidant/preferences/secteursActivite';

export class EntrepotMemoire<T extends Aggregat>
  implements EntrepotEcriture<T>
{
  protected entites: Map<crypto.UUID, T> = new Map();

  async lis(identifiant: string): Promise<T> {
    const entiteTrouvee = this.entites.get(identifiant as crypto.UUID);
    if (entiteTrouvee) {
      return Promise.resolve(cloneDeep(entiteTrouvee));
    }
    throw new AggregatNonTrouve(this.typeAggregat());
  }

  async persiste(entite: T) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  tous(): Promise<T[]> {
    return Promise.resolve(Array.from(this.entites.values()));
  }

  typeAggregat(): string {
    throw new Error('Non implémenté');
  }
}

export class EntrepotDiagnosticMemoire
  extends EntrepotMemoire<Diagnostic>
  implements EntrepotDiagnostic
{
  typeAggregat(): string {
    return 'diagnostic';
  }

  tousLesDiagnosticsAyantPourIdentifiant(
    identifiantDiagnosticsLie: UUID[]
  ): Promise<Diagnostic[]> {
    return Promise.resolve(
      identifiantDiagnosticsLie
        .map((id) => this.entites.get(id))
        .filter((d): d is Diagnostic => !!d)
    );
  }
}

export class EntrepotEvenementJournalMemoire
  extends EntrepotMemoire<Publication>
  implements EntrepotEvenementJournal {}

export class EntrepotRestitutionMemoire
  extends EntrepotMemoire<Restitution>
  implements EntrepotRestitution
{
  typeAggregat(): string {
    return 'restitution';
  }
}

export class EntrepotAidantMemoire
  extends EntrepotMemoire<Aidant>
  implements EntrepotAidant
{
  rechercheParPreferences(criteres: {
    departement: Departement;
    secteursActivite: SecteurActivite[];
  }): Promise<Aidant[]> {
    const aidantsTrouve = Array.from(this.entites.values()).filter((aidant) => {
      const departementMatche = aidant.preferences.departements.some(
        (d) => d.code === criteres.departement.code
      );
      const secteursActiviteMatchent = aidant.preferences.secteursActivite.some(
        (s) => criteres.secteursActivite.map((s) => s.nom).includes(s.nom)
      );
      return departementMatche && secteursActiviteMatchent;
    });
    return Promise.resolve(aidantsTrouve);
  }

  rechercheParEmail(email: string): Promise<Aidant> {
    const aidantTrouve = Array.from(this.entites.values()).find(
      (aidant) => aidant.email === email
    );
    if (!aidantTrouve) {
      return Promise.reject(new AggregatNonTrouve('aidant'));
    }
    return Promise.resolve(aidantTrouve);
  }

  typeAggregat(): string {
    return 'aidant';
  }
}

export class EntrepotAideMemoire
  extends EntrepotMemoire<DemandeAide>
  implements EntrepotDemandeAide
{
  public rechercheParMailFaite = false;

  async persiste(demandeAide: DemandeAide): Promise<void> {
    const demandesExistantes = Array.from(this.entites.entries())
      .filter(([, valeur]) => valeur.email === demandeAide.email)
      .map(([clef]) => clef);
    demandesExistantes.forEach((clef) => this.entites.delete(clef));
    super.persiste(demandeAide);
  }

  async rechercheParEmail(email: string): Promise<RechercheDemandeAide> {
    this.rechercheParMailFaite = true;
    const aides = Array.from(this.entites.values()).filter(
      (aide) => aide.email === email
    );

    return aides.length > 0
      ? {
          demandeAide: aides[0],
          etat: !aides[0].identifiant ? 'INCOMPLET' : 'COMPLET',
        }
      : { etat: 'INEXISTANT' };
  }
}

export class EntrepotDemandeAideLectureMemoire
  extends EntrepotMemoire<DemandeAideSimple>
  implements EntrepotDemandeAideLecture {}

export class EntrepotDemandeDevenirAidantMemoire
  extends EntrepotMemoire<DemandeDevenirAidant>
  implements EntrepotDemandeDevenirAidant
{
  rechercheDemandeEnCoursParMail(
    mail: string
  ): Promise<DemandeDevenirAidant | undefined> {
    return Promise.resolve(
      Array.from(this.entites.values()).find(
        (demande) =>
          demande.mail === mail && demande.statut === StatutDemande.EN_COURS
      )
    );
  }

  demandeExiste(mail: string): Promise<boolean> {
    return Promise.resolve(
      Array.from(this.entites.values()).some(
        (demandeDevenirAidant) => demandeDevenirAidant.mail === mail
      )
    );
  }

  typeAggregat(): string {
    return 'DemandeDevenirAidant';
  }
}

export class EntrepotStatistiquesMemoire
  extends EntrepotMemoire<Statistiques>
  implements EntrepotStatistiques
{
  lis(): Promise<Statistiques> {
    const statistiques = Object.entries(Object.fromEntries(this.entites)).map(
      ([_, stats]) => stats
    )[0];
    return Promise.resolve({
      identifiant: crypto.randomUUID(),
      nombreDiagnostics: statistiques.nombreDiagnostics,
      nombreAidants: statistiques.nombreAidants,
    });
  }
}

export class EntrepotAnnuaireAidantsMemoire
  extends EntrepotMemoire<AnnuaireAidant>
  implements EntrepotAnnuaireAidants
{
  constructor(private readonly entrepotAidant: EntrepotAidant) {
    super();
  }
  async rechercheParCriteres(
    criteresDeRecherche?: CriteresDeRecherche
  ): Promise<AnnuaireAidant[]> {
    const tousLesAidants = Array.from(await this.entrepotAidant.tous());

    if (criteresDeRecherche) {
      return Promise.resolve(
        tousLesAidants
          .filter((a) => {
            const estDansLeDepartement = a.preferences.departements
              .map((a) => a.nom as string)
              .includes(criteresDeRecherche.departement);

            let aTypeEntite = true;
            if (criteresDeRecherche.typeEntite) {
              aTypeEntite = a.preferences.typesEntites
                .map((e) => e.nom as string)
                .includes(criteresDeRecherche.typeEntite);
            }
            return estDansLeDepartement && aTypeEntite;
          })
          .map((aidant) => ({
            nomPrenom: aidant.preferences.nomAffichageAnnuaire,
            identifiant: aidant.identifiant,
            departements: aidant.preferences.departements,
          }))
      );
    }
    return Promise.resolve(
      tousLesAidants.map((aidant) => ({
        nomPrenom: aidant.preferences.nomAffichageAnnuaire,
        identifiant: aidant.identifiant,
        departements: aidant.preferences.departements,
      }))
    );
  }
}

export class EntrepotUtilisateurMemoire
  extends EntrepotMemoire<Utilisateur>
  implements EntrepotUtilisateur
{
  async rechercheParIdentifiantConnexionEtMotDePasse(
    identifiantConnexion: string,
    motDePasse: string
  ): Promise<Utilisateur> {
    const utilisateurTrouve = Array.from(this.entites.values()).find(
      (utilisateur) =>
        utilisateur.identifiantConnexion === identifiantConnexion &&
        utilisateur.motDePasse === motDePasse
    );
    if (!utilisateurTrouve) {
      throw new AggregatNonTrouve('utilisateur');
    }
    return Promise.resolve(utilisateurTrouve);
  }

  async rechercheParIdentifiantDeConnexion(
    identifiantDeConnexion: string
  ): Promise<Utilisateur> {
    const utilisateurTrouve = Array.from(this.entites.values()).find(
      (utilisateur) =>
        utilisateur.identifiantConnexion === identifiantDeConnexion
    );
    if (!utilisateurTrouve) {
      throw new AggregatNonTrouve('utilisateur');
    }
    return Promise.resolve(utilisateurTrouve);
  }

  typeAggregat(): string {
    return 'utilisateur';
  }
}

export class EntrepotProfilAidantMemoire
  extends EntrepotMemoire<ProfilAidant>
  implements EntrepotProfilAidant
{
  constructor(
    private readonly entrepotAidants: EntrepotAidant,
    private readonly entrepotUtilisateurs: EntrepotUtilisateur
  ) {
    super();
  }

  async lis(identifiant: string): Promise<ProfilAidant> {
    try {
      const aidant = await this.entrepotAidants.lis(identifiant);
      const utilisateur = await this.entrepotUtilisateurs.lis(identifiant);
      return Promise.resolve({
        identifiant: utilisateur.identifiant,
        email: aidant.email,
        nomPrenom: utilisateur.nomPrenom,
        ...(utilisateur.dateSignatureCGU && {
          dateSignatureCGU: utilisateur.dateSignatureCGU,
        }),
        consentementAnnuaire: aidant.consentementAnnuaire,
        nomAffichageAnnuaire: aidant.preferences.nomAffichageAnnuaire,
      });
    } catch (erreur) {
      throw new AggregatNonTrouve('profil Aidant');
    }
  }
}

export class EntrepotDemandeDiagnosticLibreAccesMemoire
  extends EntrepotMemoire<DemandeDiagnosticLibreAcces>
  implements EntrepotDemandeDiagnosticLibreAcces {}

export class EntrepotUtilisateurMACMemoire
  extends EntrepotMemoire<UtilisateurMAC>
  implements EntrepotUtilisateursMAC
{
  constructor(
    private readonly entrepots: {
      aidant: EntrepotAidant;
      utilisateurInscrit: EntrepotUtilisateurInscrit;
    }
  ) {
    super();
  }

  async rechercheParMail(email: string): Promise<UtilisateurMAC> {
    const aidant = await unServiceAidant(
      this.entrepots.aidant
    ).rechercheParMail(email);
    if (aidant) {
      return this.mappeAidant(aidant);
    }
    try {
      const utilisateurInscrit = await this.entrepots.utilisateurInscrit.tous();
      return this.mappeUtilisateurInscrit(
        utilisateurInscrit.filter((u) => u.email === email)[0]
      );
    } catch (_erreur) {
      return Promise.reject('Utilisateur MAC non trouvé');
    }
  }

  async rechercheParIdentifiant(
    identifiant: crypto.UUID
  ): Promise<UtilisateurMAC> {
    const aidant = await unServiceAidant(this.entrepots.aidant).parIdentifiant(
      identifiant
    );
    if (aidant) {
      return this.mappeAidant(aidant);
    }
    try {
      const utilisateurInscrit =
        await this.entrepots.utilisateurInscrit.lis(identifiant);
      return this.mappeUtilisateurInscrit(utilisateurInscrit);
    } catch (_erreur) {
      return Promise.reject('Utilisateur MAC non trouvé');
    }
  }

  private mappeUtilisateurInscrit(
    utilisateurInscrit: UtilisateurInscrit
  ): UtilisateurMAC {
    return {
      identifiant: utilisateurInscrit.identifiant,
      profil: 'UtilisateurInscrit',
      nomPrenom: utilisateurInscrit.nomPrenom,
      email: utilisateurInscrit.email,
      ...(utilisateurInscrit.dateSignatureCGU && {
        dateValidationCGU: utilisateurInscrit.dateSignatureCGU,
      }),
    };
  }

  private mappeAidant(aidant: AidantDTO): UtilisateurMAC {
    return {
      identifiant: aidant.identifiant,
      profil: estSiretGendarmerie(aidant?.siret) ? 'Gendarme' : 'Aidant',
      nomPrenom: aidant.nomComplet,
      email: aidant.email,
      ...(aidant.dateSignatureCGU && {
        dateValidationCGU: aidant.dateSignatureCGU,
      }),
    };
  }

  lis(_identifiant: string): Promise<UtilisateurMAC> {
    throw new Error('Method not implemented.');
  }

  persiste(_entite: UtilisateurMAC): Promise<void> {
    throw new Error('Method not implemented.');
  }

  tous(): Promise<UtilisateurMAC[]> {
    throw new Error('Method not implemented.');
  }

  typeAggregat(): string {
    throw new Error('Method not implemented.');
  }
}

export class EntrepotUtilisateurInscritMemoire
  extends EntrepotMemoire<UtilisateurInscrit>
  implements EntrepotUtilisateurInscrit
{
  typeAggregat(): string {
    return 'utilisateur_inscrit';
  }
}

export class EntrepotStatistiquesAidantMemoire
  implements EntrepotStatistiquesAidant
{
  protected entites: Map<crypto.UUID, StatistiquesAidant> = new Map();

  constructor(
    private readonly entrepotRelationMemoire: EntrepotRelationMemoire
  ) {}

  async lis(identifiant: string): Promise<StatistiquesAidant> {
    const entiteTrouvee = this.entites.get(identifiant as crypto.UUID);
    if (entiteTrouvee) {
      return Promise.resolve(cloneDeep(entiteTrouvee));
    }
    throw new AggregatNonTrouve('aidant');
  }

  async persiste(entite: StatistiquesAidant) {
    const entiteClonee = cloneDeep(entite);
    this.entites.set(entite.identifiant, entiteClonee);
  }

  tous(): Promise<StatistiquesAidant[]> {
    return Promise.resolve(Array.from(this.entites.values()));
  }

  async rechercheAidantSansDiagnostic(): Promise<StatistiquesAidant[]> {
    return this.rechercheParCritere((relation) => relation.length === 0);
  }

  rechercheAidantAvecNombreDeDiagnostics(): Promise<StatistiquesAidant[]> {
    return Promise.all(
      Array.from(this.entites.values()).map(async (aidant) => {
        const relation =
          await this.entrepotRelationMemoire.trouveObjetsLiesAUtilisateur(
            aidant.identifiant
          );
        return { ...aidant, nombreDiagnostics: relation.length };
      })
    );
  }

  rechercheAidantAyantExactementNDiagnostics(
    nombreDeDiagnstics: number
  ): Promise<StatistiquesAidant[]> {
    return this.rechercheParCritere(
      (relation) => relation.length === nombreDeDiagnstics
    );
  }

  rechercheAidantAyantAuMoinsNDiagnostics(
    nombreDeDiagnostics: number
  ): Promise<StatistiquesAidant[]> {
    return this.rechercheParCritere(
      (relation) => relation.length >= nombreDeDiagnostics
    );
  }

  private rechercheParCritere(critere: (relation: Tuple[]) => boolean) {
    return Promise.all(
      Array.from(this.entites.values()).map(async (aidant) => {
        const relation =
          await this.entrepotRelationMemoire.trouveObjetsLiesAUtilisateur(
            aidant.identifiant
          );
        return critere(relation) ? aidant : undefined;
      })
    ).then((aidants) => aidants.filter((a): a is StatistiquesAidant => !!a));
  }

  reinitialise() {
    this.entites = new Map();
  }
}

export class EntrepotStatistiquesUtilisateursInscritsMemoire
  extends EntrepotMemoire<StatistiquesUtilisateurInscrit>
  implements EntrepotStatistiquesUtilisateurInscrit
{
  constructor(private readonly entrepotRelation: EntrepotRelationMemoire) {
    super();
  }

  rechercheUtilisateursInscritsAvecNombreDeDiagnostics(): Promise<
    StatistiquesUtilisateurInscrit[]
  > {
    return Promise.all(
      Array.from(this.entites.values()).map(async (aidant) => {
        const relation =
          await this.entrepotRelation.trouveObjetsLiesAUtilisateur(
            aidant.identifiant
          );
        return { ...aidant, nombreDiagnostics: relation.length };
      })
    );
  }
}
