export const TAXONOMY_KINDS = {
  categories: {
    label: '分类',
    singular: '分类',
    paramKey: 'category',
    filterKey: 'category',
    description: '按分类浏览书籍与书评',
  },
  tags: {
    label: '标签',
    singular: '标签',
    paramKey: 'tag',
    filterKey: 'tag',
    description: '按标签浏览书籍与书评',
  },
  series: {
    label: '系列',
    singular: '系列',
    paramKey: 'seriesName',
    filterKey: 'series',
    description: '按系列浏览书籍与书评',
  },
};

export function taxonomyIndexPath(kind) {
  return `/${kind}/`;
}

export function taxonomyPath(kind, name) {
  return `/${kind}/${encodeURIComponent(name)}/`;
}

export function decodeTaxonomyName(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
