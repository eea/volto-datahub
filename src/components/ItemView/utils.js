const OBSOLETE_KEYS = ['obsolete', 'superseded'];

export const isObsolete = (status) => {
  let obsolete = false;
  if (status) {
    if (Array.isArray(status)) {
      if (
        status.filter((stat) => OBSOLETE_KEYS.includes(stat?.key)).length > 0
      ) {
        obsolete = true;
      }
    } else {
      if (OBSOLETE_KEYS.includes(status?.key)) {
        obsolete = true;
      }
    }
  }
  return obsolete;
};
