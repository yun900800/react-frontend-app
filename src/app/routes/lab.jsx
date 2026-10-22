import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import LabLayout from '../LabLayout';
import LabIndex from '../../lab/index/LabIndex';
import { labs } from '../../lab/registry';
import RequireAuth from '../../features/auth/components/RequireAuth';

const componentCache = new Map();

function getLabComponent(item) {
  if (!componentCache.has(item.id)) {
    componentCache.set(item.id, lazy(item.load));
  }
  return componentCache.get(item.id);
}

function LabFallback() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        color: 'var(--lux-text-muted)',
      }}
    >
      正在加载实验...
    </div>
  );
}

function LabPage({ item }) {
  const Component = getLabComponent(item);
  return (
    <Suspense fallback={<LabFallback />}>
      <Component />
    </Suspense>
  );
}

export const labRoutes = (
  <Route path="/lab" element={<LabLayout />}>
    <Route index element={<LabIndex />} />
    {labs.map((item) => (
      <Route
        key={item.id}
        path={item.path}
        element={
          item.protected ? (
            <RequireAuth>
              <LabPage item={item} />
            </RequireAuth>
          ) : (
            <LabPage item={item} />
          )
        }
      />
    ))}
  </Route>
);
