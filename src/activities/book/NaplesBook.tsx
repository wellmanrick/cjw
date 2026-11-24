import { PictureBook } from "./PictureBook";

interface Props {
  onExit: () => void;
}

export const NAPLES_PAGES = [
  { src: "/photos/naples/p01.jpg", line: "This is Conrad. Christmas break means Naples, Florida.", pos: "center 30%" },
  { src: "/photos/naples/p02.jpg", line: "Baby Charlie flies with him. Up, up goes the airplane.", pos: "center 35%" },
  { src: "/photos/naples/p03.jpg", line: "It is warm. Conrad wears shorts and a sun hat.", pos: "center 28%" },
  { src: "/photos/naples/p04.jpg", line: "Cousin Declan is here too, in a t-shirt. Hello, Naples.", pos: "center 30%" },
  { src: "/photos/naples/p05.jpg", line: "The beach sand is soft. Conrad wiggles his toes.", pos: "center 40%" },
  { src: "/photos/naples/p06.jpg", line: "Splash, splash. The Gulf water feels warm.", pos: "center 35%" },
  { src: "/photos/naples/p07.jpg", line: "Charlie laughs in his little sun hat.", pos: "center 30%" },
  { src: "/photos/naples/p08.jpg", line: "Pat, pat, pat. Conrad builds a sandcastle.", pos: "center 40%" },
  { src: "/photos/naples/p09.jpg", line: "They walk out on the Naples Pier.", pos: "center 35%" },
  { src: "/photos/naples/p10.jpg", line: "A big pelican sits on a post. Hello, bird.", pos: "center 30%" },
  { src: "/photos/naples/p11.jpg", line: "Conrad finds a pink shell. He shows it to Charlie.", pos: "center 35%" },
  { src: "/photos/naples/p12.jpg", line: "A dolphin leaps beside the boat. Wow.", pos: "center 35%" },
  { src: "/photos/naples/p13.jpg", line: "At the zoo, the flamingos are pink and tall.", pos: "center 35%" },
  { src: "/photos/naples/p14.jpg", line: "A gentle turtle naps in the sun.", pos: "center 40%" },
  { src: "/photos/naples/p15.jpg", line: "Far away, an alligator floats. They only look.", pos: "center 35%" },
  { src: "/photos/naples/p16.jpg", line: "Playground time. Conrad climbs up, up, up.", pos: "center 35%" },
  { src: "/photos/naples/p17.jpg", line: "Mini golf. The yellow ball rolls in. Hooray.", pos: "center 40%" },
  { src: "/photos/naples/p18.jpg", line: "Sweet ice cream on the sunny street. Lick, lick.", pos: "center 30%" },
  { src: "/photos/naples/p19.jpg", line: "Albert and Henry nap on the cool porch. Good dogs.", pos: "center 40%" },
  { src: "/photos/naples/p20.jpg", line: "Sunset paints the sky orange over the water.", pos: "center 35%" },
  { src: "/photos/naples/p21.jpg", line: "Christmas Eve. The palm trees wear twinkle lights.", pos: "center 30%" },
  { src: "/photos/naples/p22.jpg", line: "Boats in the harbor wear lights too. So pretty.", pos: "center 35%" },
  { src: "/photos/naples/p23.jpg", line: "Christmas morning. Conrad opens a little yellow truck. Vroom.", pos: "center 40%" },
  { src: "/photos/naples/p24.jpg", line: "Declan helps Charlie clap. Merry Christmas.", pos: "center 30%" },
  { src: "/photos/naples/p25.jpg", line: "Albert and Henry wear tiny red bows. What good boys.", pos: "center 40%" },
  { src: "/photos/naples/p26.jpg", line: "They share juicy orange slices. Mmm.", pos: "center 35%" },
  { src: "/photos/naples/p27.jpg", line: "New Year's Eve. Stars come out over the Gulf.", pos: "center 30%" },
  { src: "/photos/naples/p28.jpg", line: "Fireworks bloom in the sky. Conrad says wow.", pos: "center 30%" },
  { src: "/photos/naples/p29.jpg", line: "Three, two, one. Happy New Year, Naples.", pos: "center 30%" },
  { src: "/photos/naples/p30.jpg", line: "New Year's Day, warm sand and a big hug. We love Naples.", pos: "center 35%" },
] as const;

export function NaplesBook({ onExit }: Props) {
  return <PictureBook title="Naples" pages={NAPLES_PAGES} onExit={onExit} />;
}
