import { useEffect, useRef, useState } from 'react';
import { addPhoto, deletePhoto, listPhotos } from '../../lib/photoStore';
import { builtinCharacters } from './characters';
import styles from './timer.module.css';

interface PhotoEntry {
  id: string;
  url: string;
}

interface Props {
  selectedId: string;
  onSelect: (characterId: string) => void;
}

export function CharacterPicker({ selectedId, onSelect }: Props) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let urls: string[] = [];
    void listPhotos().then((stored) => {
      const entries = stored.map((p) => ({ id: p.id, url: URL.createObjectURL(p.blob) }));
      urls = entries.map((e) => e.url);
      setPhotos(entries);
    });
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const onFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const id = await addPhoto(file);
    const stored = await listPhotos();
    const added = stored.find((p) => p.id === id);
    if (added) {
      setPhotos((prev) => [...prev, { id, url: URL.createObjectURL(added.blob) }]);
    }
    onSelect(`photo:${id}`);
  };

  const onDeletePhoto = async (id: string) => {
    await deletePhoto(id);
    setPhotos((prev) => {
      const removed = prev.find((p) => p.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((p) => p.id !== id);
    });
    if (selectedId === `photo:${id}`) onSelect(builtinCharacters[0].id);
  };

  return (
    <div className={styles.pickerRow}>
      <button
        type="button"
        className={`${styles.pickerTile} ${styles.surpriseTile} ${
          selectedId === 'surprise' ? styles.pickerSelected : ''
        }`}
        onClick={() => onSelect('surprise')}
        aria-label="Surprise me"
      >
        ?
      </button>
      {builtinCharacters.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`${styles.pickerTile} ${selectedId === c.id ? styles.pickerSelected : ''}`}
          onClick={() => onSelect(c.id)}
          aria-label={c.name}
        >
          {c.render('happy')}
        </button>
      ))}
      {photos.map((p) => (
        <div key={p.id} className={styles.photoTileWrap}>
          <button
            type="button"
            className={`${styles.pickerTile} ${selectedId === `photo:${p.id}` ? styles.pickerSelected : ''}`}
            onClick={() => onSelect(`photo:${p.id}`)}
            aria-label="Uploaded photo"
          >
            <img src={p.url} alt="" className={styles.pickerPhoto} draggable={false} />
          </button>
          <button
            type="button"
            className={styles.photoDelete}
            onClick={() => void onDeletePhoto(p.id)}
            aria-label="Delete photo"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className={`${styles.pickerTile} ${styles.addPhotoTile}`}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Add a photo"
      >
        ＋
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void onFileChosen(e)}
      />
    </div>
  );
}
