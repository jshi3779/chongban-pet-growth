/** 黏土质感宠物角色（SVG 近似：圆润无锐角、径向渐变柔光、高光点）。猫 / 狗 / 其他 三种耳形。 */
export function Mascot({ type, label }: { type: string; label: string }) {
  const dog = type === '狗';
  const small = type === '兔子';
  return (
    <svg className="mascot" viewBox="0 0 120 120" role="img" aria-label={label}>
      <defs>
        <radialGradient id="clay" cx="38%" cy="30%" r="80%">
          <stop offset="0" className="m-stop1" />
          <stop offset="1" className="m-stop2" />
        </radialGradient>
      </defs>
      {dog ? (
        <>
          <ellipse className="m-ear" cx="26" cy="52" rx="14" ry="26" transform="rotate(14 26 52)" />
          <ellipse className="m-ear" cx="94" cy="52" rx="14" ry="26" transform="rotate(-14 94 52)" />
        </>
      ) : small ? (
        <>
          <ellipse className="m-ear" cx="42" cy="22" rx="11" ry="26" />
          <ellipse className="m-ear" cx="78" cy="22" rx="11" ry="26" />
        </>
      ) : (
        <>
          <path className="m-ear" d="M22 54 C20 28 30 16 40 20 C48 24 54 34 54 40 Z" />
          <path className="m-ear" d="M98 54 C100 28 90 16 80 20 C72 24 66 34 66 40 Z" />
          <path className="m-in" d="M30 46 C30 34 34 28 38 30 C42 32 46 38 46 42 Z" />
          <path className="m-in" d="M90 46 C90 34 86 28 82 30 C78 32 74 38 74 42 Z" />
        </>
      )}
      <ellipse className="m-body" cx="60" cy="68" rx="44" ry="40" />
      <ellipse className="m-hi" cx="42" cy="46" rx="14" ry="7" transform="rotate(-24 42 46)" />
      <circle className="m-eye" cx="44" cy="68" r="4.6" />
      <circle className="m-eye" cx="76" cy="68" r="4.6" />
      <circle className="m-hi" cx="45.6" cy="66.4" r="1.4" />
      <circle className="m-hi" cx="77.6" cy="66.4" r="1.4" />
      <ellipse className="m-cheek" cx="34" cy="80" rx="7" ry="5" />
      <ellipse className="m-cheek" cx="86" cy="80" rx="7" ry="5" />
      <path className="m-nose" d="M55 77 Q60 73 65 77 Q60 83 55 77 Z" />
    </svg>
  );
}
