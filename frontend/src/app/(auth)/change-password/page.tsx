import AuthChangePasswordForm from "@/components/auth/auth-change-password-Form";
import { getInitialEmailCookie } from "@/lib/auth-cookie";

const ChangePasswordForm = async () => {
  const initialEmail = await getInitialEmailCookie();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthChangePasswordForm defaultEmail={initialEmail} />
    </div>
  );
};

export default ChangePasswordForm;