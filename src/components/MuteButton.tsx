import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

export function MuteButton({ muted, onToggle, className }: Props) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-16 items-center justify-center rounded-full bg-paper text-ink shadow-[0_2px_6px_var(--color-shadow)] transition-transform duration-150 ease-out active:scale-[0.96]",
        className,
      )}
      onClick={onToggle}
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? <VolumeX className="size-7" strokeWidth={2.4} /> : <Volume2 className="size-7" strokeWidth={2.4} />}
    </button>
  );
}
