export interface IGetGameDataResponse {
  category_title: string;
  points: number;
  question_content: string;
  answer: string;
}

export type TTeam = {
  uid: string;
  name: string;
  points: number;
  deviceUid: string;
};
