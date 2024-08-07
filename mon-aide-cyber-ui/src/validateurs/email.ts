export const estMailValide = (email: string) => {
  const estUnEmail = email
    .trim()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  return (estUnEmail && estUnEmail?.length > 0) || false;
};
