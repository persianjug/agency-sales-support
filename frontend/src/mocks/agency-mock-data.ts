import { AgencyInfoGetApiResponse } from "@/types/api/agency-type";

// モック用の代理店マスタデータ
export const MOCK_AGENCIES: AgencyInfoGetApiResponse[] = [
  { agencyCode: "123456", agencyName: "東京第一代理店" },
  { agencyCode: "654321", agencyName: "横浜中央損保代理店" },
  { agencyCode: "111111", agencyName: "湘南あんしんパートナーズ" },
];
