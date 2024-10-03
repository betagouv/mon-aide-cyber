export type ReponseMetabase = {
  corps: string;
};
export interface AdaptateurMetabase {
  appelle(): Promise<ReponseMetabase>;
}
