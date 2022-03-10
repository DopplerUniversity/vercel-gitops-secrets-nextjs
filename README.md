# Vercel GitOps Secrets with Next.js

This is a reference repository for using [GitOps Secrets for Node.js](https://github.com/DopplerUniversity/gitops-secrets-nodejs/tree/simplified-api) on Vercel to work around the 4KB environment variable limit per deployment.

It's useful for giving the GitOps Secrets workflow a test-drive before altering an existing application, as well as providing a starting point for the pieces you'll need such as:

- An [encryption script](./bin/encrypt-secrets.js)
- A [secrets module](./lib/secrets.js) for runtime secrets decryption
- How to [use secret in a page ](./pages/index.js) via `getServerSideProps`

## Requirements

Install the [Vercel CLI](https://vercel.com/cli) and authenticate:

```sh
npm i -g vercel
vercel login
```

Install the [Doppler CLI](https://docs.doppler.com/docs/install-cli), then authenticate:

```sh
brew install gnupg
curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh
doppler login
```

## Setup

### Vercel

Click the below button create the application in Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDopplerUniversity%2Fvercel-gitops-secrets-nextjs&project-name=gitops-secrets-nextjs&repo-name=vercel-gitops-secrets-nextjs)

The deployments will fail which is expected at this stage.

Clone the repository Vercel created for this application, then open a terminal and change into the root of the repository.

Then link the local codebase to the Vercel application by running:

```sh
# Override the build and dev commands with the following:
#
# - build: npm run encrypt-secrets && npm run build
# - dev: npm run encrypt-secrets && npm run dev

vercel link
```

Create the `GITOPS_SECRETS_MASTER_KEY` environment variable for each environment:

```sh
node -e 'process.stdout.write(require("crypto").randomBytes(16).toString("hex"))' | vercel env add GITOPS_SECRETS_MASTER_KEY development
node -e 'process.stdout.write(require("crypto").randomBytes(16).toString("hex"))' | vercel env add GITOPS_SECRETS_MASTER_KEY preview
node -e 'process.stdout.write(require("crypto").randomBytes(16).toString("hex"))' | vercel env add GITOPS_SECRETS_MASTER_KEY production
```

### Doppler

Create the sample project in Doppler and link to this directory:

```sh
doppler import
doppler setup --no-interactive
```

Create Doppler Service Tokens for each environment and add to each Vercel environment:

```sh
echo -n "$(doppler configs tokens create vercel-gitops --config dev --plain)" | vercel env add DOPPLER_TOKEN development
echo -n "$(doppler configs tokens create vercel-gitops --config prev --plain)" | vercel env add DOPPLER_TOKEN preview
echo -n "$(doppler configs tokens create vercel-gitops --config prd --plain)" | vercel env add DOPPLER_TOKEN production
```

## Testing

To test that your secret updates in Doppler are making it into the Vercel deployments, change the `WELCOME_MESSAGE` secret and check the home page updates accordingly.

### Development

Test the Development environment by running the application:

```sh
npm install
vercel dev
```

The index page is at [http://localhost:3000/](http://localhost:3000/) and an API endpoint is at [http://localhost:3000/api/secrets](http://localhost:3000/api/secrets)

### Preview

Test by triggering a Preview deployment:

```sh
vercel
```

### Production

Test by triggering a Production deployment:

```sh
vercel --prod
```

## Auto Production Deploy on Secret Change

In the Vercel dashboard, create a Production deploy webhook by navigating to **Settings** > **Git**, then click the **Create Hook** button.

Copy the webhook URL, then from the [Doppler dashboard](https://dashboard.doppler.com/workplace/projects/vercel-gitops-secrets-nextjs), click **Webhooks** from left menu, then click the **+ Add** button, pasting in the webhook URL. Then once the webhook has been created, check the **PRD** checkbox.

To test the webhook, navigate to the [Production environment](https://dashboard.doppler.com/workplace/projects/vercel-gitops-secrets-nextjs/configs/prd) and change the `WELCOME_MESSAGE` secret, then click the **Save** button.

Then back in the Vercel dashboard, navigate to the **Deployments** tab and you should see a Production deploy in progress.

## Summary

Awesome work! You've seen how easy it is to work around Vercel's 4KB environment variable limit per deployment using a GitOps Secrets workflow and Doppler as the secrets provider.

## Clean Up

You'll need to manually delete the application in Vercel from the bottom of the **Setttings** > **Advanced** page.

To delete the project from Doppler, run:

```sh
doppler projects delete vercel-gitops-secrets-nextjs -y
```
