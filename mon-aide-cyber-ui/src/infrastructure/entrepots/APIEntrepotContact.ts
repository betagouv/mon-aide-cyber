type Message = {
  nom: string;
  email: string;
  message: string;
};
export interface EntrepotContact {
  envoie(message: Message): Promise<void>;
}
export class APIEntrepotContact implements EntrepotContact {
  envoie(message: Message): Promise<void> {
    return fetch('/contact', {
      method: 'POST',
      body: JSON.stringify({ ...message }),
      headers: { 'Content-Type': 'application/json' },
    }).then((reponse) => {
      if (!reponse.ok) {
        return reponse.json().then((erreur) => Promise.reject(erreur));
      }
    });
  }
}
