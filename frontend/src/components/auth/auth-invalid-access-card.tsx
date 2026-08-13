import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/auth";
import { Separator } from "../ui/separator";

type AuthInvalidAccessCardProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

/**
 * 不正アクセス・トークン無効時の通知カードコンポーネント
 */
export const AuthInvalidAccessCard = ({
  title = "無効なアクセスです",
  description = "パスワード再設定用のURLが不正か、必要な情報が含まれていません。お手数ですが、再度お手続きをお願いいたします。",
  actionLabel = "再度パスワード再設定を申請する",
  actionHref = ROUTES.FORGOT_PASSWORD,
}: AuthInvalidAccessCardProps) => {
  return (
    <Card className="w-full sm:max-w-sm text-center [--card-spacing:--spacing(8)]">
      <CardHeader className="text-center gap-2">
        <CardTitle className="text-2xl font-bold">
          {title}
        </CardTitle>
        <Separator className="my-0" />
      </CardHeader>

      <CardContent className="text-xs text-muted-foreground leading-relaxed">
        <p>{description}</p>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <div className="text-center text-xs text-muted-foreground">
          <a href={actionHref} className="underline underline-offset-4 hover:text-primary">
            {actionLabel}
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthInvalidAccessCard;
