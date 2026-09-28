import { PictureBook } from "./PictureBook";

interface Props {
  onExit: () => void;
}

export const BOSTON_PAGES = [
  { src: "/photos/bb-conrad.jpg", line: "This is Conrad. He is two years old, and this is his Boston story.", pos: "center 22%" },
  { src: "/photos/bb-charlie.jpg", line: "Baby Charlie is six months old. He is Conrad's little brother.", pos: "center 28%" },
  { src: "/photos/bb-declan.jpg", line: "This is cousin Declan. He is fifteen, and he loves Boston.", pos: "center 20%" },
  { src: "/photos/albert.jpg", line: "Here is Albert, the brown and white dog. He is a good friend.", pos: "center 40%" },
  { src: "/photos/henry.jpg", line: "And here is Henry, the white and brown dog. He likes to run.", pos: "center 28%" },
  { src: "/photos/bos-sky.jpg", line: "Hello, Boston. The tall buildings shine by the water.", pos: "center 40%" },
  { src: "/photos/bos-t.jpg", line: "The T train rumbles along. Conrad says choo choo.", pos: "center 40%" },
  { src: "/photos/bos-bricks.jpg", line: "They walk on the old red bricks. Tap, tap, tap.", pos: "center 40%" },
  { src: "/photos/bos-duckboat.jpg", line: "The duck boat drives on the street, then splashes into the river.", pos: "center 40%" },
  { src: "/photos/bos-swan.jpg", line: "Conrad and Declan ride a swan boat on the lagoon.", pos: "center 40%" },
  { src: "/photos/bos-ducklings.jpg", line: "Look. The duckling statues wait in a little line.", pos: "center 40%" },
  { src: "/photos/bos-common.jpg", line: "Albert and Henry run on the grass at the Common.", pos: "center 40%" },
  { src: "/photos/bos-frog.jpg", line: "Conrad dips his toes in the Frog Pond. It is cool.", pos: "center 40%" },
  { src: "/photos/bos-fire.jpg", line: "A big red fire truck rolls by. Woo woo.", pos: "center 40%" },
  { src: "/photos/stories.jpg", line: "Declan sits down and reads everyone a story.", pos: "center 40%" },
  { src: "/photos/sleepy.jpg", line: "Albert and Henry are sleepy after a long day.", pos: "center 40%" },
  { src: "/photos/bb-bed.jpg", line: "Goodnight, Charlie. Sleep tight, little baby.", pos: "center 22%" },
  { src: "/photos/bb-bye.jpg", line: "Bye-bye, Boston. We will see you soon.", pos: "center 22%" },
] as const;

export function BostonBook({ onExit }: Props) {
  return <PictureBook title="Boston" pages={BOSTON_PAGES} onExit={onExit} />;
}
