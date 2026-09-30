import { useCallback, useState, useTransition } from "react";
import { getAgencyInfoAction } from "@/mocks/agency-mock";

export const useAgencySearch = () => {
  const [agencyName, setAgencyName] = useState("");
  const [isSearchingAgency, startTransition] = useTransition();

  /**
   * 代理店コードが6桁の時のみ代理店名を取得する
   */
  const searchAgency = useCallback((agencyCode: string) => {
    if (!agencyCode || agencyCode.length !== 6) {
      setAgencyName("");
      return;
    }

    startTransition(async () => {
      const agency = await getAgencyInfoAction(agencyCode);
      if ('agencyCode' in agency) {
        setAgencyName(agency.agencyName);
      } else {
        setAgencyName("該当する代理店が見つかりません");
      }
    });
  }, []);

  return {
    agencyName,
    isSearchingAgency,
    searchAgency,
  };
};