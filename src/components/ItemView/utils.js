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

export const isInternalURL = (url) => {
  let internal = false;
  url.split('/').forEach((part) => {
    if (part.split('_')[6] === 'i') {
      internal = true;
    }
  });
  return internal;
};

export const isInternal = (item) => {
  let internal = false;
  const links = item?.link || [];
  links.forEach((link) => {
    if (isInternalURL(link?.url)) {
      internal = true;
    }
  });
  return internal;
};

export const groupBy = (obj, key) => {
  return obj.reduce((rv, item) => {
    const group = rv[item[key]] || [];
    group.push(item);
    rv[item[key]] = group;
    return rv;
  }, {});
};

export const SVGIcon = ({ name, size, color, className, title, onClick }) => {
  return (
    <svg
      xmlns={name.attributes && name.attributes.xmlns}
      viewBox={name.attributes && name.attributes.viewBox}
      style={{ height: size, width: 'auto', fill: color || 'currentColor' }}
      className={className ? `icon ${className}` : 'icon'}
      onClick={onClick}
      dangerouslySetInnerHTML={{
        __html: title ? `<title>${title}</title>${name.content}` : name.content,
      }}
    />
  );
};
