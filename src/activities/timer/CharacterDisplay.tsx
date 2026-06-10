import { useEffect, useState } from 'react';
import { getPhoto } from '../../lib/photoStore';
import { getBuiltinCharacter, type Mood } from './characters';
import styles from './timer.module.css';

interface Props {
  characterId: string;
  mood: Mood;
}

const moodClass: Record<Mood, string> = {
  happy: '',
  excited: 'characterWiggle',
  party: 'characterBounce',
};

/** Renders a built-in animal (mood-aware) or an uploaded photo (mood animates the container). */
export function CharacterDisplay({ characterId, mood }: Props) {
  const isPhoto = characterId.startsWith('photo:');
  const [photo, setPhoto] = useState<{ id: string; url: string } | null>(null);

  useEffect(() => {
    if (!isPhoto) return;
    let url: string | null = null;
    let cancelled = false;
    void getPhoto(characterId.slice('photo:'.length)).then((stored) => {
      if (cancelled || !stored) return;
      url = URL.createObjectURL(stored.blob);
      setPhoto({ id: characterId, url });
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [characterId, isPhoto]);

  const animation = styles[moodClass[mood]] ?? '';
  // Only use the loaded URL if it belongs to the currently selected photo.
  const photoUrl = isPhoto && photo?.id === characterId ? photo.url : null;

  if (photoUrl) {
    return (
      <div className={`${styles.characterFrame} ${animation}`}>
        <img src={photoUrl} alt="" className={styles.characterPhoto} draggable={false} />
      </div>
    );
  }

  // Fall back to the default bunny while a photo loads or if it was deleted.
  const builtin = getBuiltinCharacter(isPhoto ? 'builtin:bunny' : characterId);
  return <div className={`${styles.characterFrame} ${animation}`}>{builtin.render(mood)}</div>;
}
