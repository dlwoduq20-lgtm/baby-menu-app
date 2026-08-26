export type Gender = "female" | "male" | "unspecified";

export type Baby = {
  id: string;
  user_id: string;
  name: string;
  birth_date: string; // ISO date, e.g. "2024-10-01"
  gender: Gender;
  created_at: string;
};

export type PreferenceType = "not_eaten" | "avoid" | "favorite" | "disliked";

export type BabyPreference = {
  id: string;
  baby_id: string;
  food_name: string;
  preference_type: PreferenceType;
  created_at: string;
};

export type BabyAllergy = {
  id: string;
  baby_id: string;
  allergen: string;
  created_at: string;
};
