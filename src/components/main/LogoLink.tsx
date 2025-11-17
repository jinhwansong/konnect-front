import Link from 'next/link';

import Logo from '@/assets/logo.svg';

export default function LogoLink() {
  return (
    <Link href="/" className="block">
      <Logo />
    </Link>
  );
}
