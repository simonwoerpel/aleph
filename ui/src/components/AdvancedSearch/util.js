
export const FIELDS = [
  {
    key: 'all',
    re: /[^\s]+/g,
    process: t => t,
    compose: t => t,
  },
  {
    key: 'exact',
    re: /"[^"]+"/g,
    process: t => t.replace(/"/g,''),
    compose: t => `"${t}"`,
  },
  {
    key: 'must',
    re: /(^|\s)\+[^\s]+/g,
    process: t => t.replace(/\+/g,''),
    compose: t => `+${t.trim()}`
  },
  {
    key: 'none',
    re: /(^|\s)-[^\s]+/g,
    process: t => t.replace(/-/g,''),
    compose: t => `-${t.trim()}`,
  },
  {
    key: 'variants',
    re: /[^\s]+~[0-9]+/g,
    process: t => t.match(/(?<term>[^\s]+)~(?<distance>[0-9]+)/).groups,
    compose: t => t?.term && t.distance && `${t.term}~${t.distance}`,
  },
  {
    key: 'proximity',
    re: /"[^\s]+ [^\s]+"~[0-9]+/g,
    process: t => t.match(/"(?<term>[^\s]+) (?<term2>[^\s]+)"~(?<distance>[0-9]+)/).groups,
    compose: t => t?.term && t.term2 && t.distance && `"${t.term} ${t.term2}"~${t.distance}`,
  },
];


export const parseQueryText = (queryText) => {
  console.log('PARSING')
  const parsedResults = {};
  let qt = queryText;

  [...FIELDS].reverse().forEach(({ key, re, process }) => {
    const matches = qt.match(re) || [];
    console.log(key, matches, matches.map(process));
    parsedResults[key] = matches.map(process)
    qt = qt.replace(re, '');
  })

  console.log('parsed results', parsedResults, qt);

  return parsedResults
}

export const composeQueryText = (queryParts) => {
  console.log('COMPOSING', queryParts)
  return FIELDS
    .map(({ key, compose }) => {
      if (queryParts[key]) {
        console.log(key, queryParts[key], queryParts[key].map(compose).join(' '));
        return queryParts[key].map(compose).join(' ');
      }
      return null;
    })
    .filter(x => x.length > 0)
    .join(' ');
}
