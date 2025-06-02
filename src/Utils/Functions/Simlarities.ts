export function getSharedSimilarities(userProfile: any, viewedProfile: any) {
  const shared = [];

  // Tags
  const userTags = Array.isArray(userProfile?.Tags) ? userProfile.Tags.map((t: any) => t.tag) : [];
  const viewedTags = Array.isArray(viewedProfile?.Tags) ? viewedProfile.Tags.map((t: any) => t.tag) : [];
  const sharedTags = userTags.filter(t => viewedTags.includes(t));
  sharedTags.forEach(t => shared.push(t));

  // Core Values - Example: faith, family, ambition
  const userCore = Array.isArray(userProfile?.Core) && userProfile.Core[0] ? userProfile.Core[0] : {};
  const viewedCore = Array.isArray(viewedProfile?.Core) && viewedProfile.Core[0] ? viewedProfile.Core[0] : {};

  ['faith', 'family', 'ambition', 'politics'].forEach(key => {
    if (userCore[key] && viewedCore[key] && userCore[key] === viewedCore[key]) {
      shared.push(userCore[key]);
    }
  });

  // Love Languages
  const userLL = userProfile?.Relationships?.[0]?.loveLanguages ? JSON.parse(userProfile.Relationships[0].loveLanguages) : [];
  const viewedLL = viewedProfile?.Relationships?.[0]?.loveLanguages ? JSON.parse(viewedProfile.Relationships[0].loveLanguages) : [];
  const sharedLL = userLL.filter(l => viewedLL.includes(l));
  sharedLL.forEach(l => shared.push(l));

  // Communication
  const userComm = userProfile?.Relationships?.[0]?.communication ? JSON.parse(userProfile.Relationships[0].communication) : [];
  const viewedComm = viewedProfile?.Relationships?.[0]?.communication ? JSON.parse(viewedProfile.Relationships[0].communication) : [];
  const sharedComm = userComm.filter(c => viewedComm.includes(c));
  sharedComm.forEach(c => shared.push(c));

  // Diet
  const userDiet = userProfile?.Habits?.[0]?.diet;
  const viewedDiet = viewedProfile?.Habits?.[0]?.diet;
  if (userDiet && viewedDiet && userDiet === viewedDiet) {
    shared.push(`${userDiet} diet`);
  }

  // Religion + Sect
  const userReligion = userProfile?.Religion?.[0]?.religion;
  const viewedReligion = viewedProfile?.Religion?.[0]?.religion;
  if (userReligion && viewedReligion && userReligion === viewedReligion) {
    shared.push(userReligion);
  }

  const userSect = userProfile?.Religion?.[0]?.sect;
  const viewedSect = viewedProfile?.Religion?.[0]?.sect;
  if (userSect && viewedSect && userSect === viewedSect) {
    shared.push(userSect);
  }

  // Smoking
  const userSmoking = userProfile?.Habits?.[0]?.smoking;
  const viewedSmoking = viewedProfile?.Habits?.[0]?.smoking;
  if (userSmoking && viewedSmoking && userSmoking === viewedSmoking) {
    shared.push(`${userSmoking} smoking`);
  }

  // Drinking
  const userDrinking = userProfile?.Habits?.[0]?.drinking;
  const viewedDrinking = viewedProfile?.Habits?.[0]?.drinking;
  if (userDrinking && viewedDrinking && userDrinking === viewedDrinking) {
    shared.push(userDrinking);
  }

  // Background (countries)
  let userBackground = [];
  let viewedBackground = [];
  try {
    userBackground = userProfile?.About?.[0]?.background ? JSON.parse(userProfile.About[0].background) : [];
    viewedBackground = viewedProfile?.About?.[0]?.background ? JSON.parse(viewedProfile.About[0].background) : [];
  } catch (e) {}

  const sharedBackground = userBackground.filter(b => viewedBackground.includes(b));
  sharedBackground.forEach(bg => shared.push(`${bg}`));

  // Intentions
  const userIntent = userProfile?.Intent?.[0]?.intentions;
  const viewedIntent = viewedProfile?.Intent?.[0]?.intentions;
  if (userIntent && viewedIntent && userIntent === viewedIntent) {
    shared.push(userIntent);
  }

  // Limit to 5
  return shared.slice(0, 5);
}

