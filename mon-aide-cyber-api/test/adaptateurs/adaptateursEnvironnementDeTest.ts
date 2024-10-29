export const adaptateursEnvironnementDeTest = {
  messagerie: (
    emailMac?: string,
    expediteurMAC?: string,
    clefAPI?: string,
    expediteurInfoMAC?: string
  ) => ({
    emailMAC: () => emailMac || 'mac@email.com',
    expediteurMAC: () => expediteurMAC || 'expéditeur',
    expediteurInfoMAC: () => expediteurInfoMAC || 'expéditeur Info',
    clefAPI: () => clefAPI || 'clef',
  }),
};
