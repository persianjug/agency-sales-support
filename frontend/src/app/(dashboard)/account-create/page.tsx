import AccountCreateForm from "@/components/account-create/account-create-form";
import { getCertifications, getSpecialties } from "@/mocks/account-mock";

export const AccountCreatePage = async () => {
  const certifications = await getCertifications();
  const specialties = await getSpecialties();

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-5xl font-bold tracking-tight">アカウント作成</h1>
      </div>
      <AccountCreateForm certifications={certifications} specialties={specialties} />
    </div>
  );
}
export default AccountCreatePage;