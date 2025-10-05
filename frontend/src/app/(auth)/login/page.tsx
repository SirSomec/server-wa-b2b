'use client';

import Link from 'next/link';
import { useState } from 'react';

import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Sign in</h2>
        <form className={styles.form}>
          <label className={styles.fieldLabel} htmlFor="email">
            Email
          </label>
          <input
            className={styles.fieldInput}
            id="email"
            type="email"
            value={email}
            placeholder="admin@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <input
            className={styles.fieldInput}
            id="password"
            type="password"
            value={password}
            placeholder="********"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className={styles.submitButton} type="submit" disabled>
            Continue (coming soon)
          </button>
        </form>
        <Link className={styles.backLink} href="/">
          &larr; Back
        </Link>
      </section>
    </main>
  );
}
