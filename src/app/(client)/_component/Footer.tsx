import React from 'react'
import Link from 'next/link';
import style from './footer.module.scss';

export default function Footer() {
    const services = [
      { id: 1, title: '멘토 지원하기', link: '/mentor' },
      { id: 2, title: '분야별 멘토 찾기', link: '/mentors' },
      { id: 3, title: '아티클', link: '/article' },
    ];
    const socials = [
      {
        id: 1,
        title: '개인 블로그',
        link: 'https://song7022556.tistory.com',
      },
      {
        id: 2,
        title: '깃허브',
        link: 'https://github.com/jinhwansong?tab=repositories',
      },
    ];
    const terms = [
      {
        id: 1,
        title: '이용약관',
        link: '/term',
      },
      {
        id: 2,
        title: '개인정보처리방침',
        link: '/privacy',
      },
    ];
  return (
    <footer className={style.footer}>
      <div>
        <div className={style.footer_left}>
          <p>
            <span>커넥트</span>
            <span className={style.line} />
            <span>대표 플러팅</span>
            <span className={style.line} />
            <span>사업자등록번호: 123-45-67890</span>
            <br />

            <span>
              운영시간: 10:00~19:00(점심시간 12:00~13:00, 주말 및 공휴일 휴무)
            </span>

            <br />
            <span>주소: 경기도 고양시 일산서구 덕산로 3080</span>
            <span className={style.line} />
            <span>대표번호: 010-1234-5678</span>
            <br />
            <span>호스팅서비스 제공자 : Vercel</span>
          </p>
          <em>© 2024 커넥팅, Inc. All rights reserved.</em>
        </div>
        <ul className={style.footer_right}>
          <li>
            <em>이용약관</em>
            {terms.map((service) => (
              <Link href={service.link} key={service.id}>
                {service.title}
              </Link>
            ))}
          </li>
          <li>
            <em>서비스</em>
            {services.map((service) => (
              <Link href={service.link} key={service.id}>
                {service.title}
              </Link>
            ))}
          </li>
          <li>
            <em>소셜</em>
            {socials.map((service) => (
              <Link href={service.link} key={service.id} target="_blank">
                {service.title}
              </Link>
            ))}
          </li>
        </ul>
      </div>
    </footer>
  );
}
