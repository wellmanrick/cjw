import { PictureBook } from "./PictureBook";

interface Props {
  onExit: () => void;
}

export const BOSTON_PAGES = [
  { src: "/photos/boston/boston-01.jpg", line: "This is Conrad. He is two years old, and Boston is home.", pos: "center 40%" },
  { src: "/photos/boston/boston-02.jpg", line: "Baby Charlie is Conrad's little brother. He comes along for the ride.", pos: "center 40%" },
  { src: "/photos/boston/boston-03.jpg", line: "Cousin Declan is fifteen. He loves exploring Boston with them.", pos: "center 40%" },
  { src: "/photos/boston/boston-04.jpg", line: "Albert trots beside the Charles. Sailboats glide by.", pos: "center 40%" },
  { src: "/photos/boston/boston-05.jpg", line: "Henry is happy in the Public Garden. What a good boy.", pos: "center 40%" },
  { src: "/photos/boston/boston-06.jpg", line: "Hello, Boston. The tall buildings shine across the water.", pos: "center 40%" },
  { src: "/photos/boston/boston-07.jpg", line: "Ding, ding! Here comes the Green Line. Conrad waves at the T.", pos: "center 40%" },
  { src: "/photos/boston/boston-08.jpg", line: "Tap, tap, tap. Conrad walks the old red bricks with Albert and Henry.", pos: "center 40%" },
  { src: "/photos/boston/boston-09.jpg", line: "Splash! The Duck Boat rolls off the street and into the river.", pos: "center 40%" },
  { src: "/photos/boston/boston-10.jpg", line: "The Swan Boat glides across the lagoon. Everyone rides together.", pos: "center 40%" },
  { src: "/photos/boston/boston-11.jpg", line: "Quack, quack! Conrad finds the little ducklings in the Public Garden.", pos: "center 40%" },
  { src: "/photos/boston/boston-12.jpg", line: "They cross the Common together. There is so much to see.", pos: "center 40%" },
  { src: "/photos/boston/boston-13.jpg", line: "Splash, splash! Conrad and Charlie cool off at the Frog Pond.", pos: "center 40%" },
  { src: "/photos/boston/boston-14.jpg", line: "The crowd is loud and green. Go, Boston, go!", pos: "center 40%" },
  { src: "/photos/boston/boston-15.jpg", line: "The ice is fast. The black-and-gold team zooms by.", pos: "center 40%" },
  { src: "/photos/boston/boston-16.jpg", line: "Touchdown! Conrad, Charlie, and Declan cheer at the football game.", pos: "center 40%" },
  { src: "/photos/boston/boston-17.jpg", line: "Now they are back in the South End, where home is.", pos: "center 40%" },
  { src: "/photos/boston/boston-18.jpg", line: "Charlie rolls past the brownstones in his stroller.", pos: "center 40%" },
  { src: "/photos/boston/boston-19.jpg", line: "Declan pushes Charlie while Conrad walks beside them. Down the brick sidewalk they go.", pos: "center 40%" },
  { src: "/photos/boston/boston-20.jpg", line: "Albert and Henry know these streets too. They trot right along.", pos: "center 40%" },
  { src: "/photos/boston/boston-21.jpg", line: "Conrad climbs high at the neighborhood playground. Up, up, up!", pos: "center 40%" },
  { src: "/photos/boston/boston-22.jpg", line: "On market day, flowers and pictures fill the street.", pos: "center 40%" },
  { src: "/photos/boston/boston-23.jpg", line: "Time for a little snack. Conrad has a croissant while Charlie watches.", pos: "center 40%" },
  { src: "/photos/boston/boston-24.jpg", line: "They walk through a quiet South End garden with flowers and a fountain.", pos: "center 40%" },
  { src: "/photos/boston/boston-25.jpg", line: "The sun gets low over Boston. It has been a very big day.", pos: "center 40%" },
  { src: "/photos/boston/boston-26.jpg", line: "Back on their South End street, everyone waves goodnight.", pos: "center 40%" },
  { src: "/photos/boston/boston-27.jpg", line: "At home, Declan reads one more Boston story.", pos: "center 40%" },
  { src: "/photos/boston/boston-28.jpg", line: "Albert and Henry close their eyes. Goodnight, Boston. Goodnight, home.", pos: "center 40%" },
] as const;

export function BostonBook({ onExit }: Props) {
  return <PictureBook title="Boston" pages={BOSTON_PAGES} onExit={onExit} />;
}
