// Simple module-level store to pass skills back without remounting MainProfile
let pendingSkills: string[] | null = null;

export const setPendingSkills = (skills: string[]) => {
  pendingSkills = skills;
};

export const getPendingSkills = () => pendingSkills;

export const clearPendingSkills = () => {
  pendingSkills = null;
};