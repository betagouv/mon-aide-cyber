export const ChampSucces = ({ message }: { message: string }) => {
  return (
    <div className="fr-alert fr-alert--success fr-alert--sm">
      <p>{message}</p>
    </div>
  );
};
