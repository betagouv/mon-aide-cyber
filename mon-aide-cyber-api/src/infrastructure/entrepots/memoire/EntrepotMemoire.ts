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
  EntrepotDemandeAide,
} from '../../../gestion-demandes/aide/DemandeAide';

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
  rechercheParEmail(email: string): Promise<DemandeAide | undefined> {
    const aides = Array.from(this.entites.values()).filter(
      (aide) => aide.email === email
    );

    return aides.length > 0
      ? Promise.resolve(aides[0])
      : Promise.resolve(undefined);
  }
}

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
  rechercheParCriteres(
    criteresDeRecherche?: CriteresDeRecherche
  ): Promise<AnnuaireAidant[]> {
    const tousLesAidants = Array.from(this.entites.values());

    if (criteresDeRecherche) {
      return Promise.resolve(
        tousLesAidants.filter((a) =>
          a.departements
            .map((a) => a.nom as string)
            .includes(criteresDeRecherche.departement)
        )
      );
    }
    return Promise.resolve(tousLesAidants);
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
