import { getCertifications, getSpecialties } from "@/mocks/account-mock";
import AccountCreateForm from "@/components/account-create/account-create-form";
import BackButton from "@/components/common/button/back-button";
import PageContainer from "@/components/common/container/page-container";

export const AccountCreatePage = async () => {
  const certifications = await getCertifications();
  const specialties = await getSpecialties();

  return (
    <PageContainer
      title="アカウント作成"
      action={<BackButton />}
    >
      <AccountCreateForm certifications={certifications} specialties={specialties} />
    </PageContainer>
  );
}
export default AccountCreatePage;