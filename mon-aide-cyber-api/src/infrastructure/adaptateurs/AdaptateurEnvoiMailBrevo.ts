import {
  AdaptateurEnvoiMail,
  Destinataire,
  Email,
  Expediteur,
  UtilisateurMACEnRelation,
} from '../../adaptateurs/AdaptateurEnvoiMail';
import { ErreurEnvoiEmail } from '../../api/messagerie/Messagerie';
import {
  adaptateursRequeteBrevo,
  ErreurRequeBrevo,
} from './adaptateursRequeteBrevo';
import {
  unConstructeurEnvoiDeMail,
  unConstructeurEnvoiDeMailAvecTemplate,
} from '../brevo/ConstructeursBrevo';
import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isArray } from 'lodash';

export class AdaptateurEnvoiMailBrevo implements AdaptateurEnvoiMail {
  async envoieConfirmationDemandeAide(
    email: string,
    utilisateurMACEnRelation: UtilisateurMACEnRelation | undefined
  ): Promise<void> {
    const destinataire: Destinataire = { email };
    let constructeurEmailBrevo = unConstructeurEnvoiDeMailAvecTemplate()
      .ayantPourTemplate(
        utilisateurMACEnRelation
          ? adaptateurEnvironnement
              .brevo()
              .templateConfirmationAideEnRelationAvecUnUtilisateurMAC()
          : adaptateurEnvironnement.brevo().templateConfirmationAide()
      )
      .ayantPourDestinataires([[destinataire.email, destinataire.nom]]);
    if (utilisateurMACEnRelation) {
      constructeurEmailBrevo = constructeurEmailBrevo
        .ayantPourDestinatairesEnCopie([
          [utilisateurMACEnRelation.email, utilisateurMACEnRelation.nomPrenom],
        ])
        .ayantPourParametres({ prenom: utilisateurMACEnRelation.nomPrenom });
    }
    const emailBrevo = constructeurEmailBrevo.construis();
    try {
      await adaptateursRequeteBrevo().envoiMail().execute(emailBrevo);
    } catch (reponse: unknown | ErreurRequeBrevo) {
      throw new ErreurEnvoiEmail(
        JSON.stringify((reponse as ErreurRequeBrevo).corps),
        { cause: reponse as ErreurRequeBrevo }
      );
    }
  }

  async envoie(
    message: Email,
    expediteur: Expediteur = 'MONAIDECYBER'
  ): Promise<void> {
    const envoiDeMail = unConstructeurEnvoiDeMail()
      .ayantPourExpediteur(
        'MonAideCyber',
        expediteur === 'MONAIDECYBER'
          ? adaptateurEnvironnement.messagerie().expediteurMAC()
          : adaptateurEnvironnement.messagerie().expediteurInfoMAC()
      )
      .ayantPourDestinataires(
        isArray(message.destinataire)
          ? message.destinataire.map((destinataire) => [
              destinataire.email,
              destinataire.nom,
            ])
          : [[message.destinataire.email, message.destinataire.nom]]
      )
      .ayantEnCopie(message.copie)
      .ayantEnCopieInvisible(message.copieInvisible)
      .ayantPourSujet(message.objet)
      .ayantPourContenu(message.corps)
      .ayantEnPieceJointe(message.pieceJointe)
      .construis();
    await adaptateursRequeteBrevo()
      .envoiMail()
      .execute(envoiDeMail)
      .catch(async (reponse: unknown | ErreurRequeBrevo) => {
        throw new ErreurEnvoiEmail(
          JSON.stringify((reponse as ErreurRequeBrevo).corps),
          { cause: reponse as ErreurRequeBrevo }
        );
      });
  }
}
