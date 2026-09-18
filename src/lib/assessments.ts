import { addRecentActivity } from './admin';
import { getAuthenticatedUsername } from './auth';

const LATEST_PUSHUP_ASSESSMENT_KEY_PREFIX = 'athletiq_latest_pushup_assessment:';
const PUSHUP_ASSESSMENT_HISTORY_KEY_PREFIX = 'athletiq_pushup_assessment_history:';

export type PushupAssessment = {
  completed_reps: number;
  incomplete_reps: number;
  minimum_elbow_angle: number | null;
  maximum_elbow_angle: number | null;
  average_elbow_angle: number | null;
  pose_detection_percentage: number;
  movement_consistency: {
    completed_rep_angle_range_mean_degrees: number | null;
    completed_rep_angle_range_std_dev_degrees: number | null;
  };
};

export type PushupAssessmentResponse = PushupAssessment & {
  selected_elbow: { side: string | null; frames_by_side: Record<string, number> };
};

export type SavedPushupAssessment = PushupAssessment & {
  saved_at: string;
};

function latestAssessmentStorageKey(username: string): string {
  return `${LATEST_PUSHUP_ASSESSMENT_KEY_PREFIX}${username}`;
}

function assessmentHistoryStorageKey(username: string): string {
  return `${PUSHUP_ASSESSMENT_HISTORY_KEY_PREFIX}${username}`;
}

function toSavedAssessment(assessment: PushupAssessment): SavedPushupAssessment {
  return {
    completed_reps: assessment.completed_reps,
    incomplete_reps: assessment.incomplete_reps,
    minimum_elbow_angle: assessment.minimum_elbow_angle,
    maximum_elbow_angle: assessment.maximum_elbow_angle,
    average_elbow_angle: assessment.average_elbow_angle,
    pose_detection_percentage: assessment.pose_detection_percentage,
    movement_consistency: assessment.movement_consistency,
    saved_at: new Date().toISOString(),
  };
}

export function savePushupAssessmentResult(assessment: PushupAssessment): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;

  const savedAssessment = toSavedAssessment(assessment);
  localStorage.setItem(latestAssessmentStorageKey(username), JSON.stringify(savedAssessment));

  try {
    const storedHistory = localStorage.getItem(assessmentHistoryStorageKey(username));
    const history: SavedPushupAssessment[] = storedHistory ? JSON.parse(storedHistory) : [];
    const nextHistory = [savedAssessment, ...history.filter(item => item.saved_at !== savedAssessment.saved_at)].slice(0, 30);
    localStorage.setItem(assessmentHistoryStorageKey(username), JSON.stringify(nextHistory));
  } catch {
    localStorage.setItem(assessmentHistoryStorageKey(username), JSON.stringify([savedAssessment]));
  }

  addRecentActivity({
    actor: username,
    role: 'student',
    action: 'Assessment completed',
    details: `Push-up assessment saved for ${username}.`,
    type: 'success',
  });

  return true;
}

export function saveLatestPushupAssessment(assessment: PushupAssessment): boolean {
  return savePushupAssessmentResult(assessment);
}

export function getLatestPushupAssessment(): SavedPushupAssessment | null {
  const username = getAuthenticatedUsername();
  if (!username) return null;

  try {
    const storedAssessment = localStorage.getItem(latestAssessmentStorageKey(username));
    if (!storedAssessment) return null;
    const assessment = JSON.parse(storedAssessment) as Partial<SavedPushupAssessment>;
    if (
      typeof assessment.completed_reps !== 'number'
      || typeof assessment.incomplete_reps !== 'number'
      || typeof assessment.pose_detection_percentage !== 'number'
      || !assessment.movement_consistency
    ) {
      return null;
    }
    return assessment as SavedPushupAssessment;
  } catch {
    return null;
  }
}

export function getPushupAssessmentHistory(): SavedPushupAssessment[] {
  const username = getAuthenticatedUsername();
  if (!username) return [];

  try {
    const storedHistory = localStorage.getItem(assessmentHistoryStorageKey(username));
    if (!storedHistory) return [];
    const parsed = JSON.parse(storedHistory) as Partial<SavedPushupAssessment>[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((assessment): assessment is SavedPushupAssessment => (
      typeof assessment?.completed_reps === 'number'
      && typeof assessment?.incomplete_reps === 'number'
      && typeof assessment?.pose_detection_percentage === 'number'
      && typeof assessment?.saved_at === 'string'
      && !!assessment?.movement_consistency
    ));
  } catch {
    return [];
  }
}
