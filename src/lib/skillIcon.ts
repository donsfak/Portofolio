// Techs whose skillicons.dev icon is an empty SVG — hidden from icon rows
export const NO_ICON_TECHS = new Set(['lightgbm', 'xgboost', 'catboost', 'arcface', 'faiss']);

export function getSkillIcon(name: string) {
  const n = name.toLowerCase().replace(/\s+/g, '');
  if (n === 'rive')    return '/assets/rive.png';
  if (n === 'tableau') return '/assets/tableau.png';
  return `https://skillicons.dev/icons?i=${n}`;
}
