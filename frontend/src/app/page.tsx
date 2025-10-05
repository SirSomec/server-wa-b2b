'use client';

import Link from 'next/link';

import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>B2B WebWhatsApp x Jivo</h1>
        <p>Admin console and tenant workspaces for WhatsApp connectors and Jivo channels.</p>
        <div className={styles.actions}>
          <Link href="/login">Login</Link>
          <a href="https://www.jivo.ru/docs/chat/" target="_blank" rel="noreferrer">
            Jivo API Docs
          </a>
        </div>
      </section>
    </main>
  );
}
