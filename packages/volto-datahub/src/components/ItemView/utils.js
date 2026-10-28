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
