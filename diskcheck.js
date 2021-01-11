const nodeDiskInfo = require("node-disk-info");

const toGB = (s) => Math.round(s / 1024 / 1024 / 1024);
const toMB = (s) => Math.round(s / 1024 / 1024);
const freePercent = (total, free) => {
  return `${Math.round((free / total) * 100)}%`;
};

function getDisks(site, exclude) {
  let results = { site: site, drives: [] };
  let re = new RegExp(exclude);
  const toGB = (s) => Math.round(s / 1024 / 1024 / 1024);
  try {
    const disks = nodeDiskInfo.getDiskInfoSync();
    for (const disk of disks) {
      let result = {};
      if (disk.filesystem.match(re) === null) {
        result.filesystem = disk.filesystem;
        result.blocksGB = toGB(disk.blocks);
        result.usedGB = toGB(disk.used);
        result.availableGB = toGB(disk.available);
        result.availableMB = toMB(disk.available);
        result.availablePercent = freePercent(
          result.blocksGB,
          result.availableGB
        );
        result.mounted = disk.mounted;
        results.drives.push(result);
      } else {
        console.log(
          `Exclusion found in ${disk.filesystem}. ${disk.filesystem.match(re)}`
        );
      }
    }
    return results;
  } catch (e) {
    console.error(e);
  }
}

function printResults(title, disks) {
  console.log(`============ ${title} ==============\n`);

  for (const disk of disks) {
    console.log("Filesystem:", disk.filesystem);
    console.log("Blocks:", disk.blocks);
    console.log("Used:", disk.used);
    console.log("Available:", disk.available);
    console.log("Capacity:", disk.capacity);
    console.log("Mounted:", disk.mounted, "\n");
  }
}

module.exports = getDisks;
