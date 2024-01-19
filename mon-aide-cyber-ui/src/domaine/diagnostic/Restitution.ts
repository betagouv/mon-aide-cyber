type RessourceActionRestituer = {
  ressource: {
    url: string;
    methode: 'PATCH' | 'GET';
    contentType: 'application/pdf' | 'application/json';
  };
};
type ActionRestituer = {
  action: 'restituer';
  types: {
    [type: string]: RessourceActionRestituer;
  };
};

export type Restitution = {
  actions: ActionRestituer[];
  autresMesures: string;
  indicateurs: string;
  informations: string;
  mesuresPrioritaires: string;
};
