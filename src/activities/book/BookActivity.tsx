import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityHeader } from "@/components/ActivityHeader";
import { speak, setMuted as setSoundMuted, unlockAudio } from "@/lib/sound";
import { useSettings } from "@/lib/useSettings";
import { useWakeLock } from "@/lib/useWakeLock";
import styles from "./book.module.css";

interface Props {
  onExit: () => void;
}

export const PAGES = [
  { src: "/photos/bb-conrad.jpg", line: "This is Conrad. He is two years old, and this is his story.", pos: "center 22%" },
  { src: "/photos/bb-charlie.jpg", line: "Baby Charlie is six months old. He is Conrad's little brother.", pos: "center 28%" },
  { src: "/photos/bb-declan.jpg", line: "This is cousin Declan. He is fifteen, and he loves to ski.", pos: "center 20%" },
  { src: "/photos/declan-ski.jpg", line: "Declan skis down the big Vermont hill, all by himself.", pos: "center 40%" },
  { src: "/photos/declan-conrad-ski.jpg", line: "Today Declan teaches little Conrad how to ski.", pos: "center 28%" },
  { src: "/photos/albert.jpg", line: "Here is Albert, the brown and white dog. He is a good friend.", pos: "center 40%" },
  { src: "/photos/henry.jpg", line: "And here is Henry, the white and brown dog. He likes to run.", pos: "center 28%" },
  { src: "/photos/dogs-together.jpg", line: "Albert and Henry love to play in the snow together.", pos: "center 28%" },
  { src: "/photos/bb-lap.jpg", line: "Conrad sits on the porch and holds baby Charlie so gently.", pos: "center 22%" },
  { src: "/photos/bb-three.jpg", line: "Cousin Declan came to the A-frame to visit Conrad and Charlie.", pos: "center 40%" },
  { src: "/photos/bb-house.jpg", line: "This is our A-frame in Vermont, tucked in the snowy woods.", pos: "center 40%" },
  { src: "/photos/hello.jpg", line: "Hello, Vermont. We are here for another adventure.", pos: "center 22%" },
  { src: "/photos/snowball.jpg", line: "Conrad scoops up the snow and throws a snowball. Whoosh.", pos: "center 22%" },
  { src: "/photos/skiing.jpg", line: "Conrad clicks on his little skis and gets ready to go.", pos: "center 28%" },
  { src: "/photos/dogs.jpg", line: "Albert and Henry come along to ski with Conrad.", pos: "center 28%" },
  { src: "/photos/snowman.jpg", line: "Conrad and Declan roll a great big snowman in the yard.", pos: "center 30%" },
  { src: "/photos/sled.jpg", line: "Whee. They fly down the hill on the red sled.", pos: "center 28%" },
  { src: "/photos/bb-csled.jpg", line: "Conrad pulls baby Charlie on a tiny sled through the snow.", pos: "center 22%" },
  { src: "/photos/bb-share.jpg", line: "Conrad shows Charlie a cold white snowball. Charlie giggles.", pos: "center 22%" },
  { src: "/photos/angel.jpg", line: "Conrad lies down and waves his arms. He made a snow angel.", pos: "center 40%" },
  { src: "/photos/cocoa.jpg", line: "Inside the A-frame, it is time for warm cocoa. Sip, sip.", pos: "center 22%" },
  { src: "/photos/bb-trucks.jpg", line: "Conrad lines up his trucks in the snow. Vroom, vroom.", pos: "center 28%" },
  { src: "/photos/mower.jpg", line: "In the summer, the mower goes around and around the yard.", pos: "center 40%" },
  { src: "/photos/tractor.jpg", line: "Conrad and Declan ride up high on the yellow tractor.", pos: "center 40%" },
  { src: "/photos/bounce.jpg", line: "Bounce, bounce, bounce. The trampoline goes up and down.", pos: "center 35%" },
  { src: "/photos/bb-jump.jpg", line: "Declan and Conrad jump while baby Charlie watches from the blanket.", pos: "center 40%" },
  { src: "/photos/bikes.jpg", line: "They ride their bikes down the dirt road through the trees.", pos: "center 40%" },
  { src: "/photos/swing.jpg", line: "Conrad swings up, up, up toward the sky.", pos: "center 40%" },
  { src: "/photos/kayak.jpg", line: "Conrad and Declan paddle the orange kayak across the lake.", pos: "center 40%" },
  { src: "/photos/fishing.jpg", line: "They caught a fish. It is a really big one.", pos: "center 40%" },
  { src: "/photos/bb-dock.jpg", line: "Now they sit on the dock with baby Charlie, dangling their feet.", pos: "center 40%" },
  { src: "/photos/splash.jpg", line: "Conrad splashes in the cold lake. What a splash.", pos: "center 40%" },
  { src: "/photos/bb-quilt.jpg", line: "Conrad shows baby Charlie his favorite toy truck.", pos: "center 40%" },
  { src: "/photos/picnic.jpg", line: "They pack a picnic by the water. Everything tastes so good.", pos: "center 40%" },
  { src: "/photos/camping.jpg", line: "At night the campfire is warm and orange. Everyone sits close.", pos: "center 45%" },
  { src: "/photos/hike.jpg", line: "They walk together through the quiet woods.", pos: "center 40%" },
  { src: "/photos/moose.jpg", line: "Look, Conrad. A moose is standing in the trees.", pos: "center 40%" },
  { src: "/photos/deer.jpg", line: "In the evening, deer come into the yard to eat.", pos: "center 40%" },
  { src: "/photos/leaves.jpg", line: "Conrad jumps into a big pile of crunchy leaves.", pos: "center 40%" },
  { src: "/photos/apples.jpg", line: "They pick red apples from the tree. Crunch.", pos: "center 40%" },
  { src: "/photos/pumpkins.jpg", line: "Conrad found a great big orange pumpkin.", pos: "center 40%" },
  { src: "/photos/fireflies.jpg", line: "When it gets dark, fireflies blink in the grass.", pos: "center 40%" },
  { src: "/photos/owl.jpg", line: "Whoo, says the owl from high in the pine tree.", pos: "center 28%" },
  { src: "/photos/bb-moon.jpg", line: "Conrad and Charlie look up at the round moon.", pos: "center 22%" },
  { src: "/photos/stars.jpg", line: "There are so many stars in the Vermont sky tonight.", pos: "center 35%" },
  { src: "/photos/stories.jpg", line: "Declan sits down and reads everyone a story.", pos: "center 40%" },
  { src: "/photos/hug.jpg", line: "Conrad holds Declan's hand. He feels safe.", pos: "center 40%" },
  { src: "/photos/sleepy.jpg", line: "Albert and Henry are sleepy after a long day.", pos: "center 40%" },
  { src: "/photos/bb-bed.jpg", line: "Goodnight, Charlie. Sleep tight, little baby.", pos: "center 22%" },
  { src: "/photos/bb-bye.jpg", line: "Bye-bye, Vermont. We will see you soon.", pos: "center 22%" },
  { src: "/photos/mountains.jpg", line: "We love Vermont, and Vermont loves us too.", pos: "center 40%" },
] as const;

export function BookActivity({ onExit }: Props) {
  const { settings, update } = useSettings();
  const [page, setPage] = useState(0);
  useWakeLock(true);
  const current = PAGES[page];

  useEffect(() => {
    setSoundMuted(settings.muted);
  }, [settings.muted]);

  useEffect(() => {
    unlockAudio();
    const t = window.setTimeout(() => speak(current.line), 280);
    const next = PAGES[(page + 1) % PAGES.length];
    const prev = PAGES[(page - 1 + PAGES.length) % PAGES.length];
    for (const src of [next.src, prev.src]) {
      const img = new Image();
      img.src = src;
    }
    return () => window.clearTimeout(t);
  }, [page, current.line]);

  const go = (dir: 1 | -1) => {
    unlockAudio();
    setPage((p) => Math.min(PAGES.length - 1, Math.max(0, p + dir)));
  };

  const atStart = page === 0;
  const atEnd = page === PAGES.length - 1;

  return (
    <div className={`screen ${styles.screen}`}>
      <ActivityHeader
        title="Vermont"
        muted={settings.muted}
        onToggleMute={() => update({ muted: !settings.muted })}
        onBack={onExit}
        holdBack
      />
      <div className={styles.page}>
        <div className={styles.frame}>
          <img
            key={current.src}
            src={current.src}
            alt={current.line}
            draggable={false}
            className={styles.photo}
            style={{ objectPosition: current.pos }}
          />
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
            {page + 1} / {PAGES.length}
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
