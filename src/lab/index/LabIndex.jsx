import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { labGroups, labPath } from '../registry';
import s from './LabIndex.module.css';

export default function LabIndex() {
  const groups = labGroups.filter((group) => group.items.length > 0);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className={s.page}>
      <header className={s.hero}>
        <span className={s.eyebrow}>LAB</span>
        <h1 className={s.title}>实验室</h1>
        <p className={s.lede}>
          布局、动效与交互实验。每个实验独立加载，不会进入业务区的首屏包。
        </p>
        <p className={s.meta}>
          {total} 个实验 · {groups.length} 个分组
        </p>
      </header>

      {groups.map((group) => {
        const Icon = group.icon;
        return (
          <section className={s.group} key={group.id} aria-labelledby={`lab-group-${group.id}`}>
            <div className={s.groupHeader}>
              <Icon className={s.groupIcon} aria-hidden="true" />
              <h2 id={`lab-group-${group.id}`}>{group.label}</h2>
            </div>

            <div className={s.grid}>
              {group.items.map((item) => (
                <Link key={item.id} to={labPath(item)} className={s.card}>
                  <div className={s.cardTop}>
                    <span className={s.tag}>{group.label}</span>
                    <ArrowUpRight className={s.cardArrow} aria-hidden="true" />
                  </div>
                  <h3 className={s.cardTitle}>{item.title}</h3>
                  <p className={s.cardDescription}>{item.description}</p>
                  <span className={s.cardAction}>打开实验</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
