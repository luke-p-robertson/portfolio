import {useRef} from 'react';
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from './Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>New Things Group</title>
        <meta name="description" content="New Things Group is a decentralized design and innovation organization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <span>NTG Worldwide</span>
        <span><a href="https://instagram.com">Follow New Things</a></span>
      </nav>
      <main className={styles.main}>
        <h1 className={`${styles.title} heading_h1`}>
          New Things Group is a <em>decentralized</em> design and innovation organization<sup><a href="">1</a></sup>.
        </h1>
        <h1 className={`${styles.title} heading_h1`}>Our work expresses new technologies by the <em>power of many</em> to create novel experiences and practical tools<sup><a href="">2</a></sup>.</h1>
        
      </main>
      <footer className={styles.footer}>
        <div className={styles.footer__content}>
          <span className={styles.footnote}>01</span>
          <p>We are a Decentralized Autonomous Organization, or DAO (pronounced dow), a new kind of organization, built with blockchain technology, run democratically by its members.</p>
        </div>
        <div className={styles.footer__content}>
          <span className={styles.footnote}>02</span>
          <p>Through our resarch, we uncover the insights and opportunities that form the basis of our work, crossing the sectors of art, commerce, design, community and technology.</p>
        </div>
        <div className={styles.footer__content}></div>
      </footer>
    </div>
  )
}

export default Home
