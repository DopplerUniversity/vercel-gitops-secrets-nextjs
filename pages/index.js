import Head from 'next/head';
import styles from '../styles/Home.module.css'
import { loadSecrets } from "../lib/secrets";

export default function Home({ welcomeMessage, secretsSize }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Vercel GitOps Secrets with Next.js</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Vercel GitOps Secrets with Next.js</h1>

        <p className={styles.description}>{welcomeMessage}</p>
        <p>Total secrets size: {secretsSize}KB</p>
      </main>

      <footer className={styles.footer}>
        Powered by the {" "}
        <a href="https://github.com/DopplerUniversity/gitops-secrets-nodejs">
          Node.js GitOps Secrets
        </a>{" "}
        package
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const secrets = loadSecrets().populateEnv()
  const secretsSize = parseFloat(Buffer.byteLength(JSON.stringify(secrets), 'utf8') / 1024).toFixed(2)
  return {
    props: {
      welcomeMessage: process.env.WELCOME_MESSAGE,
      secretsSize: secretsSize
    },
  }
}
