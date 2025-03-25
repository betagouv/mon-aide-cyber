export type ContientHeader = {
  setHeader: (cle: string, valeur: string) => void;
};

export const positionneLesCsp = (reponse: ContientHeader, csp: string) => {
  reponse.setHeader('Content-Security-Policy', csp || '*');
};
