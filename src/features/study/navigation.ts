export type ConnectionRef = { id: string; kind: 'law' | 'doctrine' | 'case'; passageId: string };
export type StudyNavState = { passageId: string; selected: ConnectionRef | null; trail: ConnectionRef[] };
export const initialNavigation: StudyNavState = { passageId: 'intro', selected: null, trail: [] };

export function openConnection(state: StudyNavState, ref: ConnectionRef): StudyNavState {
  if (state.selected?.id === ref.id && state.selected.passageId === ref.passageId) return state;
  return { passageId: ref.passageId, selected: ref, trail: state.selected ? [...state.trail, state.selected] : state.trail };
}

export function goBack(state: StudyNavState): StudyNavState {
  const previous = state.trail.at(-1);
  return previous ? { passageId: previous.passageId, selected: previous, trail: state.trail.slice(0, -1) } : initialNavigation;
}
