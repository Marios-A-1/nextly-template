type HighlightedTextProps = {
  text: string;
  highlight?: string;
  highlightClassName?: string;
};

export function HighlightedText({
  text,
  highlight,
  highlightClassName = "gradient-word",
}: HighlightedTextProps) {
  if (!highlight || !text.includes(highlight)) {
    return <>{text}</>;
  }

  const [before, after] = text.split(highlight);

  return (
    <>
      {before}
      <span className={highlightClassName}>{highlight}</span>
      {after}
    </>
  );
}
