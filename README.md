![Build](https://github.com/GeekyEggo/parse-semver/workflows/Build/badge.svg)

# Node.js Package Information

A GitHub Action for parsing information from a package.json file, that aims to streamline accessing information contained within it, and polyfill where `npm pkg get` falls short.

## 📖 Use Case

Publishing a prerelease version of a package can be tricky. By default, `npm publish` ignores the prerelease identifier, and doesn't take into consideration the prerelease identifier defined on the package's version field.

Thankfully, this can be easily solved using the `version.tag` output; for example, given a version of `1.2.3-beta.0`, our workflow can access the tag directly:

```
npm publish --tag {{ steps.output.pkg.version.tag }}
```

## ⚡ Usage

See [action.yml](action.yml)

```yml
steps:
  - uses: actions/checkout@v4

  - name: info
    uses: geekyeggo/npm-package-info@v1

  - uses: actions/setup-node@v4
    with:
      node-version: "20"
      registry-url: "https://registry.npmjs.org"

  - run: npm publish --provenance --access public --tag ${{ steps.version.info.tag }}
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📤 Outputs

| Name            | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| `version.major` | Major version number                                                             |
| `version.minor` | Minor version number                                                             |
| `version.patch` | Patch version number                                                             |
| `version.tag`   | Prerelease identifier, for example `alpha`, `beta`, `rc`, etc. Default `latest`. |
