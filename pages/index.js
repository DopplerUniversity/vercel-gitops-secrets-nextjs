import HeadModule from "next/head";
const Head = HeadModule.default;
import LinkModule from "next/link";
const Link = LinkModule.default;
import styles from "../styles/Home.module.css";
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
        <p>
          <Link href="/api/secrets">
            <a>View secrets</a>
          </Link>
        </p>
      </main>

      <footer className={styles.footer}>
        Powered by the <a href="https://github.com/DopplerHQ/gitops-secrets-nodejs">Node.js GitOps Secrets</a> package
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  const secrets = loadSecrets();
  const secretsSize = parseFloat(Buffer.byteLength(JSON.stringify(secrets), "utf8") / 1024).toFixed(2);
  return {
    props: {
      welcomeMessage: secrets.WELCOME_MESSAGE,
      secretsSize: secretsSize,
    },
  };
}
