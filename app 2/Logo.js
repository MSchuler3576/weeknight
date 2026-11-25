import Link from 'next/link';

export default function Logo({ href = '/' }) {
  return (
    <Link href={href} className="logo" aria-label="Weeknight home">
      <span className="logo-mark"><span /></span>
      Weeknight
    </Link>
  );
}
