export type PairReadingRequest = {
  partnerName: string;
  partnerBirthdate: string;
  partnerBirthtime: number;
  partnerGender: "male" | "female";
  relationshipType:
    | "romantic_partner"
    | "family_member"
    | "friend"
    | "business_partner"
    | "colleague";
  specificRelation?: string;
};
