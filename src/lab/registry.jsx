import { Boxes, GlassWater, LayoutGrid, Sparkles, Wrench } from 'lucide-react';

/**
 * The lab is a registry, not a route list.
 * Adding an experiment = add a folder + one entry here.
 * `load` must return a module with a default export.
 */
export const labGroups = [
  {
    id: 'layouts',
    label: '布局实验',
    icon: LayoutGrid,
    items: [
      {
        id: 'responsive',
        title: '响应式流',
        description: '随视口流动的响应式布局实验。',
        path: 'layouts/responsive',
        fullBleed: true,
        load: () => import('../features/home/pages/ResponsiveFlowApp'),
      },
      {
        id: 'fixed',
        title: '固定结构',
        description: '固定头部与内容区的结构实验。',
        path: 'layouts/fixed',
        fullBleed: true,
        load: () => import('../features/home/pages/FixedStructureApp'),
      },
      {
        id: 'shelf',
        title: '书架布局',
        description: '3D 书架的全屏布局实验。',
        path: 'layouts/shelf',
        fullBleed: true,
        load: () =>
          import('../features/home/pages/FullPageApp').then((module) => ({
            default: module.FullPageApp,
          })),
      },
      {
        id: 'page-book',
        title: '单页书',
        description: '单页书阅读布局实验。',
        path: 'layouts/page-book',
        fullBleed: true,
        load: () => import('../features/home/pages/FullPageBookApp'),
      },
      {
        id: 'flipbook',
        title: '翻页书',
        description: '翻页交互与排版实验。',
        path: 'layouts/flipbook',
        fullBleed: true,
        load: () =>
          import('../features/home/pages/FlipPageApp').then((module) => ({
            default: module.FlipPageApp,
          })),
      },
      {
        id: 'full-bleed',
        title: '全出血',
        description: '无边距内容区域实验。',
        path: 'layouts/full-bleed',
        fullBleed: true,
        load: () =>
          import('../features/home/pages/FullBleedPage').then((module) => ({
            default: module.FullBleedPage,
          })),
      },
    ],
  },
  {
    id: 'motion',
    label: '动效实验',
    icon: Sparkles,
    items: [
      {
        id: 'animation',
        title: '动效总览',
        description: '过渡、手势、链式动画的综合示例。',
        path: 'motion',
        load: () => import('../features/animation/pages/AnimationPage'),
      },
      {
        id: 'smart-menu',
        title: '智能菜单',
        description: '多状态智能菜单的动效实现。',
        path: 'motion/smart-menu',
        load: () => import('../features/animation/pages/SmartMenuPage'),
      },
    ],
  },
  {
    id: 'visual',
    label: '视觉实验',
    icon: GlassWater,
    items: [
      {
        id: 'happiness-bottle',
        title: '幸福瓶',
        description: '可配置水色与四叶草的玻璃瓶视觉实验。',
        path: 'visual/happiness-bottle',
        fullBleed: true,
        load: () => import('./happiness-bottle/HappinessBottleLab'),
      },
    ],
  },
  {
    id: 'interaction',
    label: '3D / 交互',
    icon: Boxes,
    items: [
      {
        id: 'book-shelf',
        title: '3D 书架组件',
        description: '实验室复用业务区 3D 书架，验证不同布局。',
        path: 'interaction/book-shelf',
        load: () => import('./interaction/BookShelfLab'),
      },
      {
        id: 'book-reader',
        title: '书页阅读器',
        description: '左右两种翻页方向的业务阅读器。',
        path: 'interaction/book-reader',
        load: () => import('./interaction/BookReaderLab'),
      },
    ],
  },
  {
    id: 'tools',
    label: '工具',
    icon: Wrench,
    items: [
      {
        id: 'api-debug',
        title: 'API 调试',
        description: '后端接口连通性与响应调试（需要登录）。',
        path: 'tools/api-debug',
        protected: true,
        load: () => import('../components/TestComponent'),
      },
    ],
  },
];

export const labs = labGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupId: group.id,
    groupLabel: group.label,
  })),
);

export const labPath = (item) => `/lab/${item.path}`;

export function findLab(pathname) {
  const exact = labs.find((item) => pathname === labPath(item));
  if (exact) return exact;

  return labs
    .filter((item) => pathname.startsWith(`${labPath(item)}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];
}

export function findLabGroup(item) {
  return labGroups.find((group) => group.id === item?.groupId);
}
