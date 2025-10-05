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
        <h2>Sign in</h2>
        <form>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="admin@example.com"
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="********"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" disabled>
            Continue (coming soon)
          </button>
        </form>
        <Link href="/">&larr; Back</Link>
      </section>
    </main>
  );
}
