# ModuleNFT API Monorepo

This repo is the mono-repo for module NFT API

When you have serveral highly coupled projects which you want to organize them together, you can consider a monorepo.

Yarn (1.x) provide the workspace feature to help organize a monorepo project.

Yarn workspace has serveral advantages like:
- Hoist same dependecies to top level to avoid duplicate install.
- Upgrade dependencies is much more easier.
- Easy to run a same script for all projects.

## File Structure

```
├── module-core (the shared library)
│   ├── package.json
│   ├── src
│   │   └── index.ts
├── opensea-api
│   ├── package.json
│   ├── src
│   │   ├── index.ts
├── metadata-api
│   ├── package.json
│   ├── src
│   │   ├── index.ts
├── looksrare-api
│   ├── package.json
│   ├── src
│   │   ├── index.ts
├── events-api
│   ├── package.json
│   ├── src
│   │   ├── index.ts
├── package.json
```
