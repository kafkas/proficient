<h1 align="center">
  <a href="https://kafkas.github.io/proficient/util">
    @proficient/util
  </a>
</h1>

<p align="center">
    High-quality and essential TypeScript utilities
</p>

---

<p align="center">
    <a href="https://github.com/kafkas/proficient/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Proficient is released under the MIT license." /></a>
    <a href="https://npmjs.com/package/@proficient/util" alt="Version">
        <img src="https://img.shields.io/npm/v/@proficient/util" /></a>
    <a href="https://npmjs.com/package/@proficient/util" alt="Size">
        <img src="https://img.shields.io/bundlephobia/min/@proficient/util" /></a>
    <a href="https://npmjs.com/package/@proficient/util" alt="Downloads">
        <img src="https://img.shields.io/npm/dm/@proficient/util" /></a>
    <a href="https://" alt="Types">
        <img src="https://img.shields.io/npm/types/@proficient/util" /></a>
    <a href="https://lerna.js.org/" alt="Framework">
        <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" /></a>
    <a href="https://github.com/kafkas/proficient">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" /></a>
</p>

[**View the full documentation (docs) ▸**](https://kafkas.github.io/proficient/util)

## Overview

1. [Installation](#Installation)
2. [API](#API)
3. [Upgrading](#Upgrading)
4. [License](#License)

## Installation

```
# npm
npm install -E @proficient/util

# yarn
yarn add -E @proficient/util
```

## [API](https://kafkas.github.io/proficient/util)

### [makeRetriable](https://kafkas.github.io/proficient/util/0.2/modules.html#makeRetriable)

Creates a retriable version of a given function, which, when invoked, is continuously retried according to the specified retry config until it succeeds. The new function returns a Promise that resolves when the original function succeeds or `maxTrialCount` is reached.

### [registerInterval](https://kafkas.github.io/proficient/util/0.2/modules.html#registerInterval)

Registers an async callback that keeps running in the background until it is unregistered. Waits for the callback Promise to resolve and sleeps for an additional `duration` ms and invokes the callback again.

### [sleep](https://kafkas.github.io/proficient/util/0.2/modules.html#sleep)

Sleeps for a specified number of milliseconds.

## Upgrading

Until we release v1, there may be breaking changes between minor versions (e.g. when upgrading from 0.2 to 0.3). However, all breaking changes will be documented and you can always use our [Releases](https://github.com/kafkas/proficient/releases) page as a changelog.

## License

This project is made available under the MIT License.
