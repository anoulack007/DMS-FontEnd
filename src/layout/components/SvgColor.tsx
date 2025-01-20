import SVG from 'react-inlinesvg';

interface Props {
  src: string;
}
function SvgColor({ src }: Props) {
  return (
    <SVG
      src={src}
      onLoad={() => {
        const paths = document.querySelectorAll('path');
        paths.forEach((path) => {
          path.setAttribute('stroke', 'currentColor');
        });
      }}
    />
  );
}

export default SvgColor;
