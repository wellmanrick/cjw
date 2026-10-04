import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { speak, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { asset } from "@/lib/asset";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import styles from "./book.module.css";

export type SpritePosition = {
  col: number;
  row: number;
  cols: number;
  rows: number;
};

export type BookPage = {
  src: string;
  line: string;
  pos: string;
  sprite?: SpritePosition;
};

interface Props {
  title: string;
  pages: readonly BookPage[];
  onExit: () => void;
}

function resolveBookAsset(src: string) {
  if (/^(?:data:|blob:|https?:\/\/)/.test(src)) return src;
  return asset(src);
}

function spritePercent(index: number, count: number) {
  return count <= 1 ? 0 : (index / (count - 1)) * 100;
}

export function PictureBook({ title, pages, onExit }: Props) {
  const { settings, update } = useSettings();
  const [page, setPage] = useState(0);
  useWakeLock(true);
  const current = pages[page];
  const currentSrc = resolveBookAsset(current.src);

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    unlockAudio();
    const t = window.setTimeout(() => speak(current.line), 280);
    const next = pages[(page + 1) % pages.length];
    const prev = pages[(page - 1 + pages.length) % pages.length];

    for (const neighbor of [next, prev]) {
      const src = resolveBookAsset(neighbor.src);
      if (src === currentSrc) continue;
      const img = new Image();
      img.src = src;
    }

    return () => window.clearTimeout(t);
  }, [page, current.line, currentSrc, pages]);

  const go = (dir: 1 | -1) => {
    unlockAudio();
    setPage((p) => Math.min(pages.length - 1, Math.max(0, p + dir)));
  };

  const atStart = page === 0;
  const atEnd = page === pages.length - 1;

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title={title}
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <div className={styles.page}>
        <div className={styles.frame}>
          {current.sprite ? (
            <div
              key={`sprite-${page}`}
              role="img"
              aria-label={current.line}
              className={`${styles.photo} ${styles.spritePhoto}`}
              style={{
                backgroundImage: `url("${currentSrc}")`,
                backgroundSize: `${current.sprite.cols * 100}% ${current.sprite.rows * 100}%`,
                backgroundPosition: `${spritePercent(current.sprite.col, current.sprite.cols)}% ${spritePercent(current.sprite.row, current.sprite.rows)}%`,
              }}
            />
          ) : (
            <img
              key={current.src}
              src={currentSrc}
              alt={current.line}
              draggable={false}
              className={styles.photo}
              style={{ objectPosition: current.pos }}
            />
          )}
          <button
            type="button"
            className={`${styles.hot} ${styles.hotBack}`}
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label="Previous page"
          />
          <button
            type="button"
            className={`${styles.hot} ${styles.hotNext}`}
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label="Next page"
          />
        </div>
        <p className={styles.line}>{current.line}</p>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            disabled={atStart}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-8" strokeWidth={2.8} />
          </button>
          <p className={styles.pageNum}>
            {page + 1} / {pages.length}
          </p>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            disabled={atEnd}
            aria-label="Next page"
          >
            <ChevronRight className="size-8" strokeWidth={2.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
