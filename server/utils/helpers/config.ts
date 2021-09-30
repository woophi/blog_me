export const checkConfiguration = (config: { [key: string]: any }) => {
  const missingConfigs: string[] = [];
  Object.keys(config).forEach(key => {
    if (config[key] === undefined) {
      missingConfigs.push(key);
    }
  });
  if (missingConfigs.length) {
    console.error('Missing configs for', missingConfigs.join(', '));
    process.exit(1);
  }
};
