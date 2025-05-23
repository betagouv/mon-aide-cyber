export function ratioEspaceOccupe({ top, hauteur, hauteurFenetre }) {
  if (top < 0 && hauteur + top < 0) return 0;
  if (top > hauteurFenetre) return 0;
  const hauteurVisible = hauteur - Math.abs(top);
  return Math.min(hauteurVisible, hauteurFenetre) / hauteurFenetre;
}

export function elementLePlusVisible(elements, hauteurFenetre) {
  const leRatioDe = (element) =>
    ratioEspaceOccupe({
      top: element.getBoundingClientRect().top,
      hauteur: element.getBoundingClientRect().height,
      hauteurFenetre,
    });

  const vainqueur = elements.reduce((vainqueur, candidat) => {
    const ratioVainqueur = leRatioDe(vainqueur);
    const ratioCandidat = leRatioDe(candidat);

    return ratioCandidat > ratioVainqueur ? candidat : vainqueur;
  });

  const vainqueurEstInvisible = leRatioDe(vainqueur) === 0;
  return vainqueurEstInvisible ? null : vainqueur;
}
