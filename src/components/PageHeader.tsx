import { Link } from "react-router-dom";
import { Home, Menu, type LucideIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  backTo?: string;
}

/**
 * Unified sticky page header used across all interior routes so the app
 * "rhymes" — deep forest gradient, editorial italic wordmark, home + menu
 * on either side. Fully responsive from 320px up.
 */
export const PageHeader = ({ icon: Icon, title, subtitle, rightSlot, backTo = "/" }: PageHeaderProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 gradient-header px-3 sm:px-6 py-3 sm:py-4 shadow-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={toggleSidebar}
            aria-label="Menu"
            className="flex-shrink-0 text-primary-foreground/85 hover:text-primary-foreground p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex-shrink-0 bg-accent/25 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl ring-1 ring-accent/30">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display italic text-primary-foreground text-xl sm:text-2xl leading-none truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="hidden sm:block text-primary-foreground/60 text-[10px] font-bold uppercase tracking-[0.18em] mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {rightSlot}
          <Link
            to={backTo}
            aria-label="Home"
            className="text-primary-foreground/85 hover:text-primary-foreground p-2 rounded-xl bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
