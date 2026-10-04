import { PictureBook, type BookPage } from "./PictureBook";
import { BOSTON_SPRITE } from "./bostonSprite";

interface Props {
  onExit: () => void;
}

const COLS = 4;
const ROWS = 7;
const CELL_WIDTH = 320;
const CELL_HEIGHT = 400;

function page(index: number, line: string): BookPage {
  return {
    src: BOSTON_SPRITE,
    line,
    pos: "center 40%",
    sprite: {
      col: index % COLS,
      row: Math.floor(index / COLS),
      cols: COLS,
      rows: ROWS,
      cellWidth: CELL_WIDTH,
      cellHeight: CELL_HEIGHT,
    },
  };
}

export const BOSTON_PAGES = [
  page(0, "This is Conrad. He is two years old, and Boston is home."),
  page(1, "Baby Charlie is Conrad's little brother. He comes along for the ride."),
  page(2, "Cousin Declan is fifteen. He loves exploring Boston with them."),
  page(3, "Albert trots beside the Charles. Sailboats glide by."),
  page(4, "Henry is happy in the Public Garden. What a good boy."),
  page(5, "Hello, Boston! The tall buildings shine across the water."),
  page(6, "Ding, ding! Here comes the Green Line. Conrad waves at the T."),
  page(7, "Tap, tap, tap. Conrad walks the old red bricks with Albert and Henry."),
  page(8, "Splash! The Duck Boat rolls off the street and into the river."),
  page(9, "The Swan Boat glides across the lagoon. Everyone rides together."),
  page(10, "Quack, quack! Conrad finds the little ducklings in the Public Garden."),
  page(11, "They cross Boston Common together. There is so much to see."),
  page(12, "Splash, splash! Conrad and Charlie cool off at the Frog Pond."),
  page(13, "At the Celtics game, the crowd is loud and green. Go, Celtics, go!"),
  page(14, "At the Bruins game, skates zip across the ice. Go, Bruins!"),
  page(15, "At the Patriots game, everybody cheers. Touchdown!"),
  page(16, "Now they are back in the South End, where home is."),
  page(17, "Charlie rolls past the South End brownstones in his stroller."),
  page(18, "Declan pushes Charlie while Conrad walks beside them. Tap, tap, down the bricks."),
  page(19, "Albert and Henry know these South End streets too. They trot right along."),
  page(20, "Conrad climbs high at the neighborhood playground. Up, up, up!"),
  page(21, "At the South End market, flowers and pictures fill the street."),
  page(22, "Time for a little snack. Conrad has a croissant while Charlie watches."),
  page(23, "They walk through a quiet South End garden with flowers and a fountain."),
  page(24, "The sun gets low over Boston. It has been a very big day."),
  page(25, "Back on their South End street, everyone waves goodnight."),
  page(26, "At home, Declan reads one more Boston story."),
  page(27, "Albert and Henry close their eyes. Goodnight, Boston. We love our home."),
] as const;

export function BostonBook({ onExit }: Props) {
  return <PictureBook title="Boston" pages={BOSTON_PAGES} onExit={onExit} />;
}
