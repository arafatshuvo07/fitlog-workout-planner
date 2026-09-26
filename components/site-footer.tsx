import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/workouts";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <Link href="/" className="brand">
          <Image src={assetUrl("/logo.png")} width={24} height={24} alt="" />
          FITLOG
        </Link>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </div>
    </footer>
  );
}
