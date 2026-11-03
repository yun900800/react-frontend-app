import {
  House,
  Users,
  BookOpen,
  SquarePen,
  Bot,
  CalendarDays,
  FlaskConical,
} from 'lucide-react';

/**
 * Product navigation is the single source of truth for the business shell.
 * Items are also reused by the mobile bottom bar and the "more" drawer.
 */
export const productNavItems = [
  { id: 'home', to: '/workbench', label: '工作台', icon: House },
  { id: 'clients', to: '/clients', label: '客户管理', icon: Users },
  { id: 'books', to: '/books', label: '图书', icon: BookOpen },
  { id: 'editor', to: '/editor', label: '评论编辑', icon: SquarePen },
  { id: 'ai', to: '/ai', label: 'AI 助手', icon: Bot },
  { id: 'calendar', to: '/calendar', label: '日历', icon: CalendarDays },
];

export const productGroups = [
  { id: 'business', label: '业务', items: productNavItems },
];

export const productFooterItems = [
  { id: 'lab', to: '/lab', label: '实验室', icon: FlaskConical },
];

const findItem = (id) => productNavItems.find((item) => item.id === id);

export const productMobilePrimary = [
  findItem('home'),
  findItem('clients'),
  findItem('books'),
  findItem('ai'),
].filter(Boolean);

export const productMobileSecondary = [
  findItem('editor'),
  findItem('calendar'),
  productFooterItems[0],
].filter(Boolean);

const PRODUCT_BREADCRUMBS = {
  '/workbench': [{ label: '工作台' }],
  '/clients': [{ label: '工作台', to: '/workbench' }, { label: '客户管理' }],
  '/clients/list': [
    { label: '工作台', to: '/workbench' },
    { label: '客户管理', to: '/clients' },
    { label: '客户列表' },
  ],
  '/clients/create': [
    { label: '工作台', to: '/workbench' },
    { label: '客户管理', to: '/clients' },
    { label: '新建客户' },
  ],
  '/books': [{ label: '工作台', to: '/workbench' }, { label: '图书' }],
  '/editor': [{ label: '工作台', to: '/workbench' }, { label: '评论编辑' }],
  '/ai': [{ label: '工作台', to: '/workbench' }, { label: 'AI 助手' }],
  '/calendar': [{ label: '工作台', to: '/workbench' }, { label: '日历' }],
};

export function getProductBreadcrumbs(pathname) {
  if (PRODUCT_BREADCRUMBS[pathname]) {
    return PRODUCT_BREADCRUMBS[pathname];
  }

  if (pathname.startsWith('/clients')) {
    return PRODUCT_BREADCRUMBS['/clients'];
  }

  return PRODUCT_BREADCRUMBS['/workbench'];
}

export function getProductTitle(pathname) {
  const crumbs = getProductBreadcrumbs(pathname);
  return crumbs[crumbs.length - 1]?.label || '工作台';
}
