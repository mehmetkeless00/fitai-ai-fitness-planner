const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo guard: --legacy-peer-deps leaves stale packages at the workspace root
// (e.g. react-native@0.79 alongside apps/mobile's 0.81). Metro's default
// hierarchical lookup finds whichever copy is closest to the requiring file,
// so both versions end up in the bundle and Fabric initialization crashes.
// disableHierarchicalLookup forces ALL resolution through nodeModulesPaths in
// priority order, guaranteeing apps/mobile's versions win everywhere.
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = withNativeWind(config, { input: './global.css' });
