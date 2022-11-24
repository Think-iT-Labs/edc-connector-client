# Contributing

All code you commit and submit by pull-request should follow these simple guidelines.

## Branching

When creating a branch for your work, always use [git flow](https://nvie.com/posts/a-successful-git-branching-model/) convention.

Our flavoured flow, comprehend following prefixes:

- `feat/` - everything that is not a bug should be created with this prefix;
- `fix/` - from the git flow point of view, this is just another way to call feat/. It's helpful to have such a differentiation to prioritize reviews better.
- `release/` - needed to prepare the release.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

## Pull requests

1. Open the pull request giving a title following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Keep the title short (~50 characters). Always try to give a scope to the title. You should chose between: `api`, `cli`, `core`, `docs`, `www`, `tests` and `edc-manager-client`. If your code affect more than one scope, combine them comma-separated (e.g. `feat(core,api): ...`).

  Following this convention will help up create sleek changelogs.

2. Try to fill the pull request template as closely as possible. Provide a short description that answers these questions:

  - "how this pull request will change the code?"
  - "what is the purpose of these changes?"
  
  Take the opporutnity to reflect on your learnings and share them with everyone else.

3. For any task, try to provide a way to test its results; it would greatly help the Q&A process.

4. Assign the pull request to yourself and request @fdionisi to review it.

5. Upon approval, you are in charge of merging the code back. It's crucial to own the code we create and ensure it **is released**. If you wish your code is merged upon approval, please, specify it in the pull request description.

6. Upon merge (ndr. squash and merge), remember to delete the merged working branch; let's keep a clean repository.

## New features & bug fixes

Within this project, we follow a _Test-Driven Development_ (TDD) approach.
