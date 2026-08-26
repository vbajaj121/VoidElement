// Isolated re-export so the dynamic `import()` in lazy-motion-provider.tsx
// has a clean module boundary to code-split on — importing straight from
// 'framer-motion' inside the dynamic import can end up in the same chunk as
// everything else that touches the package.
export { domAnimation as default } from 'framer-motion'
