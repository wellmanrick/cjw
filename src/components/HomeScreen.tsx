import { activities } from '../activities/registry';
import styles from './components.module.css';

interface Props {
  onOpenActivity: (id: string) => void;
}

export function HomeScreen({ onOpenActivity }: Props) {
  return (
    <div className={`screen ${styles.home}`}>
      <h1 className={styles.homeTitle}>Let's play!</h1>
      <div className={styles.activityGrid}>
        {activities.map((activity) => (
          <button
            key={activity.id}
            type="button"
            className={styles.activityTile}
            onClick={() => onOpenActivity(activity.id)}
          >
            <span className={styles.activityIcon}>{activity.icon}</span>
            {activity.title}
          </button>
        ))}
      </div>
    </div>
  );
}
