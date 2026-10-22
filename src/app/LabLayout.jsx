import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, FlaskConical } from 'lucide-react';
import AppShell from '../shared/ui/navigation/AppShell';
import {
  findLab,
  findLabGroup,
  labGroups,
  labPath,
} from '../lab/registry';

const navGroups = labGroups
  .filter((group) => group.items.length > 0)
  .map((group) => ({
    id: group.id,
    label: group.label,
    items: group.items.map((item) => ({
      id: item.id,
      to: labPath(item),
      label: item.title,
      end: true,
    })),
  }));

export default function LabLayout() {
  const { pathname } = useLocation();
  const current = findLab(pathname);
  const currentGroup = findLabGroup(current);

  const breadcrumbs = current
    ? [
        { label: '实验室', to: '/lab' },
        { label: currentGroup?.label || '实验', to: '/lab' },
        { label: current.title },
      ]
    : [{ label: '实验室' }];

  return (
    <AppShell
      brand={{ label: '实验室', to: '/lab', icon: FlaskConical }}
      groups={navGroups}
      footerItems={[{ id: 'workspace', to: '/', label: '返回工作台', icon: ArrowLeft }]}
      breadcrumbs={breadcrumbs}
      title={current?.title || '实验室'}
      fullBleed={Boolean(current?.fullBleed)}
      actions={<Link to="/">返回工作台</Link>}
    >
      <Outlet />
    </AppShell>
  );
}
