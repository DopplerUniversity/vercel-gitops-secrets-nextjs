# Vercel GitOps Secrets with Next.js

This is a reference repository for using [GitOps Secrets for Node.js](https://github.com/DopplerUniversity/gitops-secrets-nodejs) on Vercel to work around the 4KB environment variable limit per deployment.

It's a great way to give the GitOps Secrets workflow a test-drive!

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

Click the below button to create the application in Vercel:

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

Import the sample project to Doppler:

[![Import to Doppler](https://raw.githubusercontent.com/DopplerUniversity/app-config-templates/main/doppler-button.svg)](https://dashboard.doppler.com/workplace/template/import?template=https://github.com/DopplerUniversity/vercel-gitops-secrets-nextjs/blob/main/doppler-template.yaml)

Configure your local environment by changing into the root level of the cloned repository and run:

```sh
doppler setup --no-interactive
```

Then create Doppler Service Tokens for each environment in Vercel:

```sh
echo -n "$(doppler configs tokens create vercel-gitops --config dev --plain)"  | vercel env add DOPPLER_TOKEN development
echo -n "$(doppler configs tokens create vercel-gitops --config prev --plain)" | vercel env add DOPPLER_TOKEN preview
echo -n "$(doppler configs tokens create vercel-gitops --config prd --plain)"  | vercel env add DOPPLER_TOKEN production
```

## Testing

You can quickly test the `encrypt-secrets` script locally with throwaway `DOPLER_TOKEN` and `GITOPS_SECRETS_MASTER_KEY` environment variables by running:

```sh
GITOPS_SECRETS_MASTER_KEY="$(node -e 'process.stdout.write(require("crypto").randomBytes(16).toString("hex"))')" \
DOPPLER_TOKEN="$(doppler configs tokens create temp --max-age 1m --plain)" \
npm run encrypt-secrets
```

The easiest way to verify updates in Doppler being propagated is by changing the `WELCOME_MESSAGE` secret.

## Local Development

Local development works just like in Vercel thanks to the Vercel CLI:

```sh
npm install
vercel dev
```

The index page is at [http://localhost:3000/](http://localhost:3000/) and an API endpoint is at [http://localhost:3000/api/secrets](http://localhost:3000/api/secrets)

### Preview

Trigger a Preview deployment by running:

```sh
vercel
```

### Production

Trigger a Production deployment by running:

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
