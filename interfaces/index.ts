export type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface OtherSkills {
  name: string;
  level: Level;
}

export interface Skills {
  reactJS: Level;
  reactNative: Level;
  nodeJS: Level;
  aws: Level;
  noSql: Level;
  otherSkills?: OtherSkills[];
}

export interface UserSetting {
  githubProfile: string;
  linkedinProfile: string;
}

export class Evaluation {
  score: number;
  message: string;
}

export class SkillData {
  userSetting: UserSetting;

  skills: Skills;
}
