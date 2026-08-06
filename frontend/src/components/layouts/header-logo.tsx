import Link from "next/link"
import { Shield } from "lucide-react"

const HeaderLogo = () => {
  return (
    <div className="flex items-center gap-2 font-bold text-lg">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Shield className="h-5 w-5 text-primary" />
        <span>App Name</span>
      </Link>
    </div>
  );
}

export default HeaderLogo;