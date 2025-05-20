export function calculateCompatibility(user: any, target: any): number {
  let score = 0;
  let possible = 0;

  const compare = (a: any, b: any) => {
    if (a && b) {
      possible++;
      if (a === b) score++;
    }
  };

  const compareArray = (a: string[], b: string[]) => {
    if (a && b && a.length && b.length) {
      possible++;
      if (a.some(item => b.includes(item))) score++;
    }
  };

  const getSection = (profile: any, section: string) =>
    profile?.[section]?.[0] || {};

  // Core values
  const userCore = getSection(user, "Core");
  const targetCore = getSection(target, "Core");
  [
    "faith",
    "career",
    "family",
    "ambition",
    "politics",
    "conflicts",
    "decisions",
    "independence",
  ].forEach(key => compare(userCore[key], targetCore[key]));

  // Religion
  const userRel = getSection(user, "Religion");
  const targetRel = getSection(target, "Religion");
  ["religion", "sect", "practicing"].forEach(key =>
    compare(userRel[key], targetRel[key])
  );

  // Relationships (parse stringified arrays)
  const userReln = getSection(user, "Relationships");
  const targetReln = getSection(target, "Relationships");
  ["communication", "values", "loveLanguages", "time"].forEach(key => {
    try {
      const ua = JSON.parse(userReln[key] || "[]");
      const ta = JSON.parse(targetReln[key] || "[]");
      compareArray(ua, ta);
    } catch {}
  });

  // Prompts
  const userPrompts = user?.Prompts?.filter(p => p.response)?.length || 0;
  const targetPrompts = target?.Prompts?.filter(p => p.response)?.length || 0;
  if (userPrompts > 0 && targetPrompts > 0) {
    possible++;
    score++;
  }

  // Tags (traits/hobbies)
  const userTags = user?.Tags?.map(t => t.tag) || [];
  const targetTags = target?.Tags?.map(t => t.tag) || [];
  compareArray(userTags, targetTags);

  // Habits
  const userHabits = getSection(user, "Habits");
  const targetHabits = getSection(target, "Habits");
  ["diet", "sleep", "hasKids", "smoking", "drinking", "wantsKids"].forEach(key =>
    compare(userHabits[key], targetHabits[key])
  );

  // Intent
  const userIntent = getSection(user, "Intent");
  const targetIntent = getSection(target, "Intent");
  ["intentions", "timeline", "relocate", "firstStep", "marriage"].forEach(key =>
    compare(userIntent[key], targetIntent[key])
  );

  return possible > 0 ? Math.round((score / possible) * 100) : 0;
}
