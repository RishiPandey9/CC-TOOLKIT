# 🛡️ CC-TOOLKIT: Classical & Modern Cryptography Studio

[![Next.js](https://img.shields.io/badge/Next.js-15%2B%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Automated Tests](https://img.shields.io/badge/Tests-22%2F22%20Passing%20(100%25)-emerald?style=for-the-badge&logo=checkmarx)](https://github.com/RishiPandey9/CC-TOOLKIT.git)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Edge-000000?style=for-the-badge&logo=vercel)](https://cctool-delta.vercel.app/)

A state-of-the-art, interactive **Classical & Modern Cryptography Studio** with **DSA-driven Cryptanalysis Engines, Simplified DES (S-DES) Feistel visualizers, Multi-Layer Cipher Pipelines, and In-Browser Automated Verification Test Suites**.

---

## ⚡ Core Features & Capabilities

### 1. 🗝️ Interactive Cipher Studio (10 Classical & Polygraphic Ciphers)
- **Caesar Cipher**: Real-time shift modulo 26 with interactive dial slider and automated Chi-Squared ($\chi^2$) best-shift detector.
- **Monoalphabetic Substitution**: Full 26-character custom permutation key builder, validation badges, and Fisher-Yates random generator.
- **Playfair Cipher**: 5x5 dynamic matrix visualizer ($I/J$ merged), digraph pair builder, and real-time rule tracer (same-row, same-col, rectangle).
- **Vigenère Cipher**: Polyalphabetic stream encryption, repeated keyword tracer, and real-time Index of Coincidence (IoC) meter.
- **Rail Fence (Zigzag) Cipher**: Multi-rail wave oscillator with animated 2D matrix placement view.
- **Row-Column Transposition**: Permutation matrix formatter, automatic padding cycling (`X`, `Y`, `Z`), and key column sort visualizer.
- **Hill Cipher (Linear Algebra mod 26)**: Supports both $2\times 2$ and $3\times 3$ matrix operations, modular determinant calculator, coprime verification, and Extended Euclidean adjugate matrix inversion.
- **Affine Cipher**: Modular arithmetic transform $E(x) = (ax + b) \bmod 26$ with coprime multiplier selection and modular inverse precomputation.
- **ROT13 & Atbash**: Instant symmetric reciprocal involutions ($f(f(x)) = x$).

---

### 2. 🔗 Chained Multi-Layer Pipeline Engine
- **Arbitrary Layer Chaining**: Add, delete, reorder, and configure individual algorithms and keys at each layer.
- **Pre-Configured Industry Presets**: Tri-Cipher Hybrid, Financial Grade Transposition, and Quantum Involution Chain.
- **Reversible Decryption Pipeline**: Automatically inverts layer order and applies exact mathematical inverses.
- **Live Pipeline Flow Log**: Real-time audit stream showing intermediate text transformations and sub-millisecond execution timings.

---

### 3. 🧠 Simplified DES (S-DES) Deep-Dive Studio
- **Complete Feistel Architecture**:
  - **10-Bit Key Schedule**: $P10 \to \text{Split} \to LS\text{-}1 \to P8 (K_1) \to LS\text{-}2 \to P8 (K_2)$.
  - **Round 1 & Round 2 Transformations**: Initial Permutation ($IP$), Expansion Permutation ($EP$), subkey XOR, S-Boxes ($S_0$ & $S_1$) coordinate highlighter, $P4$ permutation, left-half XOR, and Feistel swap.
  - **Inverse Initial Permutation ($IP^{-1}$)**: Clean bit output.
- **Multi-Block ECB Mode**: Encrypt and decrypt arbitrary multi-character ASCII strings using 8-bit block byte chunking.

---

### 4. 🔍 Cryptanalysis & Cracking Suite
- **Statistical Frequency Analysis**: Dual-bar comparison charts comparing observed text unigrams against standard English reference distributions ($ETAOINSHRDLU$).
- **AI Heuristic Cracker (Simulated Annealing & Hill Climbing)**: Autonomous key mutation optimizer that evaluates log-likelihood $N$-gram scores and dictionary word matches without requiring a key!
- **Known-Plaintext Attack (KPA)**: Recovers partial substitution alphabets from known plaintext fragments.
- **Caesar & Vigenère Auto-Detection**: Chi-Squared ($\chi^2$) ranking and Kasiski / Friedman IoC key length prediction.

---

### 5. 🧮 DSA & Cryptographic Math Lab
- **Extended Euclidean Algorithm**: Interactive step-by-step division tableau calculating $\gcd(a, b)$ and Bézout coefficients ($ax + by = \gcd(a, b)$).
- **Matrix Inversion mod 26**: Real-time determinant and adjugate matrix solver.
- **Trie (Prefix Tree) Data Structure**: $O(L)$ dictionary index supporting continuous text word segmentation.
- **Big-O Complexity Matrix**: Asymptotic time and auxiliary space bounds for all algorithms.

---

### 6. ⏱️ Live Benchmark Lab
- In-browser real-time benchmarking measuring operations per second, average latency (milliseconds), and computational throughput across all algorithms.

---

## 🧪 Automated Testing & Verification Suite

CC-Toolkit comes with an integrated **22-test automated verification suite** that tests mathematical invariants, cipher round-trip decryptions, S-DES academic test vectors, and cryptanalysis heuristics.

To run the automated tests locally:
```bash
npm test
```

Sample output:
```text
====================================================
  CC-TOOLKIT AUTOMATED VERIFICATION TEST RUNNER     
====================================================

📁 [DSA Math]
  ✅ PASS : Extended Euclidean Algorithm computes gcd & Bézout coefficients (0.1ms)
  ✅ PASS : Modular multiplicative inverse mod 26 (0.08ms)
  ✅ PASS : Coprime verification (0.04ms)
  ✅ PASS : 2x2 and 3x3 Modular Matrix Inversion (0.13ms)

📁 [DSA Data Structures]
  ✅ PASS : Trie Prefix Tree inserts, searches, and matches words (0.26ms)

📁 [Classical Ciphers]
  ✅ PASS : Caesar Cipher Encrypt / Decrypt Round-Trip (0.2ms)
  ✅ PASS : Caesar Chi-Squared Cracker finds optimal shift (1.32ms)
  ✅ PASS : Monoalphabetic Substitution Encrypt / Decrypt Round-Trip (0.51ms)
  ✅ PASS : Playfair Cipher 5x5 Matrix & Digraph Processing (0.51ms)
  ✅ PASS : Vigenère Cipher Encrypt / Decrypt & IoC Analysis (0.37ms)
  ✅ PASS : Rail Fence (Zigzag) Cipher Encrypt / Decrypt (0.23ms)
  ✅ PASS : Row-Column Transposition Encrypt / Decrypt (0.35ms)
  ✅ PASS : Hill Cipher 2x2 & 3x3 Modular Matrix Encryption (0.56ms)
  ✅ PASS : Affine Cipher (ax + b mod 26) (0.31ms)
  ✅ PASS : ROT13 & Atbash Symmetric Involutions (0.15ms)

📁 [S-DES Engine]
  ✅ PASS : Key Schedule Subkeys K1 and K2 generation (0.13ms)
  ✅ PASS : 8-bit Block Encrypt and Decrypt Known Academic Vector (0.46ms)
  ✅ PASS : Multi-Block ASCII Text Encryption & Decryption (ECB Mode) (0.4ms)

📁 [Multi-Layer Pipeline]
  ✅ PASS : Chain 3 Layers (Caesar -> Vigenère -> Rail Fence) and reverse decrypt (0.36ms)

📁 [Cryptanalysis]
  ✅ PASS : Frequency Analysis accurately counts letter distribution (0.24ms)
  ✅ PASS : Known-Plaintext Attack reconstructs partial key mapping (0.16ms)
  ✅ PASS : Hill Climbing Heuristic produces valid candidate keys (10.64ms)

----------------------------------------------------
Total Tests : 22 | Passed : 22 | Failed : 0 (100% Pass Rate)
----------------------------------------------------
```

---

## 🚀 Running Locally & Vercel Deployment

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Deploying to Vercel
1. Push this repository to GitHub: `git push origin main`
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset will be automatically detected as **Next.js**.
4. Click **Deploy**!

---

## 👤 Author & Credits
- **Developer**: Rishi Pandey
- **GitHub**: [@RishiPandey9](https://github.com/RishiPandey9)
- **Repository**: [https://github.com/RishiPandey9/CC-TOOLKIT.git](https://github.com/RishiPandey9/CC-TOOLKIT.git)
