import { encoded, translations } from './data.js';

function decode(encoded, translations) {
  const uniqueIds = new Set();
  const decoded = encoded.map((i) => {
    const decodedItem = {};
    Object.entries(i).forEach(([key, value]) => {
      if (key.endsWith('Id') && !['groupdId', 'service', 'formatSize', 'ca'].includes(key)) {
        const decodedValue = translations[value] || value;
        decodedItem[key] = decodedValue;
        uniqueIds.add(value);
      } else {
        decodedItem[key] = value;
      }
    });
    return decodedItem;
  });
  return { decoded, uniqueIds: Array.from(uniqueIds) };
}

console.log("Let's rock");
const { decoded, uniqueIds } = decode(encoded, translations);
console.log(decoded);
console.log(uniqueIds);
