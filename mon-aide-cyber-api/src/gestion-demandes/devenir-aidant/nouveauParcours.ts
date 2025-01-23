import { adaptateurEnvironnement } from '../../adaptateurs/adaptateurEnvironnement';
import { isAfter } from 'date-fns';
import { FournisseurHorloge } from '../../infrastructure/horloge/FournisseurHorloge';

export const estDateNouveauParcoursDemandeDevenirAidant = () => {
  const dateNouveauParcoursDemandeDevenirAidant =
    adaptateurEnvironnement.nouveauParcoursDevenirAidant();
  return (
    dateNouveauParcoursDemandeDevenirAidant &&
    isAfter(
      FournisseurHorloge.maintenant(),
      FournisseurHorloge.enDate(dateNouveauParcoursDemandeDevenirAidant)
    )
  );
};

export const dateNouveauParcoursAidant = () =>
  FournisseurHorloge.enDate(
    adaptateurEnvironnement.nouveauParcoursDevenirAidant()
  );

export const estAvantDateNouveauParcours = () =>
  !estDateNouveauParcoursDemandeDevenirAidant();
