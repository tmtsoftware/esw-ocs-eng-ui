# Releasing

1. Create a branch named `branch-<major>.<minor>.x` if not already exists from `master`. Example branch name `branch-3.0.x`.
   All subsequent release for this release cycle should be done on this branch. All further steps are to be done on this branch.
2. Add release notes (`notes/<version>.markdown`) - only for RC and Main release
3. Update top-level `CHANGELOG.md`
4. Update top-level `README.md`
5. Update `@tmtsoftware/esw-ts` & other dependencies in the package.json
6. Update `version` number in `package.json`, run `npm install` to update `package-lock.json`.
7. Edit ESW version and sequencer-scripts version in docs/src/main/Getting-started.md
8. Create a version compatibility table in the README.md (if there is none) - for esw, csw and esw-ocs-eng-ui
9. Commit and push the changes to `branch-<major>.<minor>.x` branch. Ensure that pipeline is green for dev and paradox link check.
10. Run `release.sh $VERSION$` script by providing version number argument (This triggers release workflow)
   For ex: If you are publishing `1.0.0` then run `PROD=true ./release.sh v1.0.0`
   Note: `PROD=true` environment variable needs to be set before running `release.sh`
After release pipeline is green:

11. Merge this release branch to master.
12. verify paradox documentation are published.
