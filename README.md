![Build](https://github.com/GeekyEggo/parse-semver/workflows/Build/badge.svg)

# Node.js Package Information

A GitHub Action for retrieving information from a package.json file, similar to `npm pkg get`, with some extra ✨.

## 📖 Use Case

Publishing a prerelease version of a package can be tricky. By default, `npm publish` ignores the prerelease identifier, and doesn't take into consideration the [tag](https://docs.npmjs.com/cli/v10/commands/npm-publish#tag) defined in the package's version field.

Using `@geekyeggo/npm-pkg` solves this by parsing the `version.tag` from the package.json file; for example, given a version of `1.2.3-beta.0`, a workflow can access the tag directly:

```
npm publish --tag {{ steps.output.pkg.version.tag }}
```

## ⚡ Usage

See [action.yml](action.yml)

<!-- prettier-ignore-start -->
```yml
steps:
  - uses: actions/checkout@v4

  - name: pkg
    uses: geekyeggo/npm-pkg@v1

  # When version is "1.0.0-rc.1", the tag output will be "rc".
  - run: echo ${{ steps.pkg.outputs.version-tag }}
```
<!-- prettier-ignore-end -->

## 📥 Inputs

| Name   | Description                                                         |
| ------ | ------------------------------------------------------------------- |
| `path` | Optional path to the package.json file; default `"./package.json"`. |

## 📤 Outputs

| Name            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `version-major` | Major version number                                                                 |
| `version-minor` | Minor version number                                                                 |
| `version-patch` | Patch version number                                                                 |
| `version-tag`   | Tag parsed from the prerelease identifier, for example `"beta"`; default `"latest"`. |

Interested in more outputs? Consider creating [a pull request](https://github.com/geekyeggo/npm-pkg/compare). 💙
