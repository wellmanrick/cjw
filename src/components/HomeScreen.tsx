import { activities } from "@/activities/registry";
import styles from "./components.module.css";

interface Props {
  onOpenActivity: (id: string) => void;
}

export function HomeScreen({ onOpenActivity }: Props) {
  return (
    <div className={`screen ${styles.home}`}>
      <header className={styles.homeHeader}>
        <p className={styles.kicker}>Toddler Time</p>
        <h1 className={styles.homeTitle}>Let's play</h1>
      </header>
      <div className={styles.activityGrid}>
        {activities.map((activity) => (
          <button
            key={activity.id}
            type="button"
            className={styles.activityTile}
            style={{ background: activity.color }}
            onClick={() => onOpenActivity(activity.id)}
          >
            <span className={styles.activityIcon}>{activity.icon}</span>
            <span className={styles.activityName}>{activity.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
