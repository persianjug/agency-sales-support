import AuthInvalidAccessCard from "@/components/auth/auth-invalid-access-card";
import AuthResetPasswordForm from "@/components/auth/auth-reset-password-Form";

type ResetPasswordFormProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ResetPasswordForm = async ({ searchParams }: ResetPasswordFormProps) => {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <AuthInvalidAccessCard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordForm;