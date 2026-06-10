import { CharacterDisplay } from './CharacterDisplay';
import type { Mood } from './characters';
import { hidingSpots, spotForCharacter } from './hidingSpots';
import styles from './timer.module.css';

interface Props {
  characterId: string;
  mood: Mood;
  /** false while counting down (character hides), true at the end (surprise!). */
  revealed: boolean;
  /** Stronger wiggling as the reveal gets close. */
  excited?: boolean;
}

/**
 * The surprise: during the countdown the character hides in its spot
 * (chick in the egg, frog in the pond, cow behind the barn...), peeking out
 * now and then, and pops out when the timer finishes.
 */
export function HidingScene({ characterId, mood, revealed, excited = false }: Props) {
  const spot = hidingSpots[spotForCharacter(characterId)];
  const hasLid = Boolean(spot.lid);

  const characterState = revealed
    ? spot.reveal === 'above'
      ? styles.characterRevealedAbove
      : styles.characterRevealed
    : hasLid
      ? styles.characterTucked // fully covered — peeking would clip through the lid
      : styles.characterPeeking;

  const sceneryWiggle = revealed ? '' : excited ? styles.spotWiggleFast : styles.spotWiggleSlow;

  return (
    <div className={styles.scene} aria-label={revealed ? undefined : spot.name}>
      {spot.back && <div className={styles.spotLayer}>{spot.back}</div>}
      <div className={`${styles.characterHolder} ${characterState}`}>
        <CharacterDisplay characterId={characterId} mood={mood} />
      </div>
      <div className={`${styles.spotLayer} ${sceneryWiggle}`}>{spot.front}</div>
      {spot.lid && (
        <div className={`${styles.spotLayer} ${revealed ? styles.lidOff : sceneryWiggle}`}>
          {spot.lid}
        </div>
      )}
    </div>
  );
}
