const estDansLeFutur = (dateString: string) =>
  new Date(dateString) > new Date();

export function BandeauDePromotionMSC() {
  const dateDebutAffichage: string = import.meta.env[
    'VITE_MSC_BANDEAU_PROMOTION_DATE_DEBUT'
  ];

  const pasEncoreVisible =
    !dateDebutAffichage || estDansLeFutur(dateDebutAffichage);

  if (pasEncoreVisible) return null;

  return (
    <lab-anssi-mes-services-cyber-bandeau></lab-anssi-mes-services-cyber-bandeau>
  );
}
