import { ArrowLeft } from "lucide-react";
import { HoldButton } from "@/components/HoldButton";
import { MuteButton } from "@/components/MuteButton";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  /** When true, back requires a 2-second hold so little fingers can't escape. */
  holdBack?: boolean;
}

export function ActivityHeader({ title, muted, onToggleMute, onBack, holdBack = false }: Props) {
  return (
    <header className="flex w-full items-center justify-between gap-3">
      {holdBack ? (
        <HoldButton onHoldComplete={onBack} className="min-h-12 min-w-24 px-4 text-sm">
          Hold to leave
        </HoldButton>
      ) : (
        <button
          type="button"
          className={cn(
            "flex size-16 items-center justify-center rounded-full bg-paper text-ink shadow-[0_2px_6px_var(--color-shadow)] transition-transform duration-150 ease-out active:scale-[0.96]",
          )}
          onClick={onBack}
          aria-label="Back"
        >
          <ArrowLeft className="size-7" strokeWidth={2.6} />
        </button>
      )}
      <h1 className="m-0 flex-1 text-center text-2xl font-semibold leading-tight text-blush-dark">{title}</h1>
      <MuteButton muted={muted} onToggle={onToggleMute} />
    </header>
  );
}
