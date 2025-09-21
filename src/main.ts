
import 'source-map-support/register';
import { idGenMain } from './id-gen';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {
  setProcName();

  await idGenMain();
}

function setProcName() {
  process.title = 'septem-ezd-2';
}
