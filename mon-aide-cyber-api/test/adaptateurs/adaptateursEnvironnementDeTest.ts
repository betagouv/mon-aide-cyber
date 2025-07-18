type ParametresMessagerieTest = {
  emailMac?: string;
  copieMac?: string;
  expediteurMAC?: string;
  clefAPI?: string;
  expediteurInfoMAC?: string;
};

export const adaptateursEnvironnementDeTest = {
  messagerie: (parametresMessagerie?: ParametresMessagerieTest) => ({
    mattermost: () => ({
      webhook: () => '',
    }),
    brevo: () => ({
      emailMAC: () => parametresMessagerie?.emailMac || 'mac@email.com',
      expediteurMAC: () => parametresMessagerie?.expediteurMAC || 'expéditeur',
      copieMAC: () => parametresMessagerie?.copieMac || 'copie',
      expediteurInfoMAC: () =>
        parametresMessagerie?.expediteurInfoMAC || 'expéditeur Info',
      clefAPI: () => parametresMessagerie?.clefAPI || 'clef',
    }),
  }),
};
