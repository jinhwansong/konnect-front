'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HiOutlineUserPlus,
  HiOutlineUser,
  HiOutlineCog8Tooth,
  HiOutlineCreditCard,
  HiOutlineSquaresPlus,
} from 'react-icons/hi2';
import { IcLogo } from '@/asset';
import style from './nav.module.scss';


export default function Nav() {
  const pathname = usePathname();
  const navItems = [
    {
      id: 1,
      title: '대시보드',
      icon: <HiOutlineSquaresPlus />,
      href: '/admin',
    },
    {
      id: 2,
      title: '사용자 관리',
      icon: <HiOutlineUser />,
      href: '/admin/users',
    },
    {
      id: 3,
      title: '멘토 신청 관리',
      icon: <HiOutlineUserPlus />,
      href: '/admin/mentors' ,
    },
    {
      id: 4,
      title: '결제/환불 관리',
      icon: <HiOutlineCreditCard />,
      href: '/admin/payments',
    },
    {
      id: 5,
      title: '고객지원 관리',
      icon: <HiOutlineCog8Tooth />,
      href: '/admin/support',
    },
  ];
  const active = (href:string) => {
    if(href === '/admin'){
      return pathname === '/admin'
    }
    return pathname.includes(href)
  }
  return (
    <aside className={style.aside}>
      <div>
        <div className={style.logo}>
          <Link href="/admin">
            <IcLogo />
          </Link>
        </div>
        <nav className={style.nav}>
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={active(item.href) ? style.active : ''}
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p>© 2024 커넥팅, Inc. All rights reserved.</p>
    </aside>
  );
}
