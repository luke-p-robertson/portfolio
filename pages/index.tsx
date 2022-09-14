import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from './Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>New Things Group</title>
        <meta name="description" content="New Things Group is a decentralized design and innovation organization" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav>
        <span>NTG Worldwide</span>
        <span><a href="https://instagram.com">Follow New Things</a></span>
      </nav>
      <main className={styles.main}>
        <h1 className={`${styles.title} heading_h1`}>
          New Things Group is a <em>decentralized</em> design and innovation organization<sup><a href="">1</a></sup>.
        </h1>
        <h1 className={`${styles.title} heading_h1`}>Our work expresses new technologies by the <em>power of many</em> to create novel experiences and practical tools<sup><a href="">2</a></sup>.</h1>
        
      </main>

    </div>
  )
}

export default Home
