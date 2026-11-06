import { useState } from 'react';
import HappinessBottle from './components/HappinessBottle.jsx';
import styles from './HappinessBottleLab.module.css';

const WATER_PRESETS = [
  { label: '蓝', value: '#00ccff' },
  { label: '粉', value: '#ff00cc' },
  { label: '黄', value: '#fff014' },
  { label: '绿', value: '#5ae600' },
];

const DEFAULT_LEAF_COLOR = '#2cb62c';
const MIN_CLOVERS = 1;
const MAX_CLOVERS = 5;
const MIN_LEAVES = 2;
const MAX_LEAVES = 10;

const DEFAULT_CONFIG = {
  waterColor: '#00ccff',
  clovers: [{ leaves: 4, leafColors: [] }],
  jellyfish: true,
  bubbles: true,
};

const PRESETS = [
  {
    label: '原版蓝',
    waterColor: '#00ccff',
    clovers: [{ leaves: 4 }],
    jellyfish: true,
    bubbles: true,
  },
  {
    label: '樱花粉',
    waterColor: '#ff00cc',
    clovers: [{ leaves: 3 }],
    jellyfish: true,
    bubbles: true,
  },
  {
    label: '柠檬黄',
    waterColor: '#fff014',
    clovers: [
      { leaves: 5, leafColors: ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff'] },
    ],
    jellyfish: false,
    bubbles: true,
  },
  {
    label: '青草绿',
    waterColor: '#5ae600',
    clovers: [{ leaves: 2 }],
    jellyfish: true,
    bubbles: true,
  },
  {
    label: '深海',
    waterColor: '#007aff',
    clovers: [
      { leaves: 6, leafColors: ['#64d2ff', '#30d158', '#ffd60a', '#ff9f0a', '#ff375f', '#bf5af2'] },
    ],
    jellyfish: true,
    bubbles: false,
  },
  {
    label: '四色叶',
    waterColor: '#00ccff',
    clovers: [{ leaves: 4, leafColors: ['#ff3b30', '#ffcc00', '#34c759', '#007aff'] }],
    jellyfish: false,
    bubbles: true,
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function HappinessBottleLab() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [previewTheme, setPreviewTheme] = useState('follow');

  const setWaterColor = (waterColor) => setConfig((c) => ({ ...c, waterColor }));

  const setCloverCount = (next) => {
    const count = clamp(next, MIN_CLOVERS, MAX_CLOVERS);
    setConfig((c) => {
      if (count === c.clovers.length) return c;
      if (count < c.clovers.length) {
        return { ...c, clovers: c.clovers.slice(0, count) };
      }
      const extra = Array.from({ length: count - c.clovers.length }, () => ({
        leaves: 4,
        leafColors: [],
      }));
      return { ...c, clovers: [...c.clovers, ...extra] };
    });
  };

  const updateClover = (index, patch) => {
    setConfig((c) => ({
      ...c,
      clovers: c.clovers.map((clover, i) => (i === index ? { ...clover, ...patch } : clover)),
    }));
  };

  const setLeafColor = (index, leafIndex, color) => {
    setConfig((c) => {
      const clovers = c.clovers.map((clover, i) => {
        if (i !== index) return clover;
        const colors = Array.from({ length: clover.leaves }, (_, n) =>
          clover.leafColors[n] ?? DEFAULT_LEAF_COLOR
        );
        colors[leafIndex] = color;
        return { ...clover, leafColors: colors };
      });
      return { ...c, clovers };
    });
  };

  const reset = () => {
    setConfig(DEFAULT_CONFIG);
    setPreviewTheme('follow');
  };

  return (
    <div className={styles.lab} data-theme={previewTheme === 'follow' ? undefined : previewTheme}>
      <h1 className={styles.title}>幸福瓶</h1>
      <div className={styles.layout}>
        <div className={styles.stage}>
          <HappinessBottle
            size="lg"
            waterColor={config.waterColor}
            clovers={config.clovers}
            jellyfish={config.jellyfish}
            bubbles={config.bubbles}
          />
        </div>

        <aside className={styles.panel} aria-label="幸福瓶配置面板">
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>水色</h2>
            <div className={styles.row}>
              <input
                type="color"
                className={styles.colorInput}
                value={config.waterColor}
                onChange={(event) => setWaterColor(event.target.value)}
                aria-label="水色"
              />
              <code className={styles.hex}>{config.waterColor}</code>
            </div>
            <div className={styles.swatches}>
              {WATER_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={styles.swatch}
                  style={{ background: preset.value }}
                  onClick={() => setWaterColor(preset.value)}
                  aria-label={`水色预设：${preset.label}`}
                  aria-pressed={config.waterColor === preset.value}
                />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>四叶草</h2>
            <div className={styles.row}>
              <span>株数</span>
              <div className={styles.stepper}>
                <button
                  type="button"
                  onClick={() => setCloverCount(config.clovers.length - 1)}
                  disabled={config.clovers.length <= MIN_CLOVERS}
                  aria-label="减少一株"
                >
                  −
                </button>
                <span className={styles.count}>{config.clovers.length}</span>
                <button
                  type="button"
                  onClick={() => setCloverCount(config.clovers.length + 1)}
                  disabled={config.clovers.length >= MAX_CLOVERS}
                  aria-label="增加一株"
                >
                  +
                </button>
              </div>
            </div>

            {config.clovers.map((clover, index) => {
              const colors = Array.from({ length: clover.leaves }, (_, n) =>
                clover.leafColors[n] ?? DEFAULT_LEAF_COLOR
              );
              return (
                <div className={styles.cloverCard} key={index}>
                  <div className={styles.cardTitle}>第 {index + 1} 株</div>
                  <div className={styles.row}>
                    <span>叶片数</span>
                    <input
                      type="number"
                      className={styles.number}
                      min={MIN_LEAVES}
                      max={MAX_LEAVES}
                      value={clover.leaves}
                      onChange={(event) =>
                        updateClover(index, {
                          leaves: clamp(Number(event.target.value) || MIN_LEAVES, MIN_LEAVES, MAX_LEAVES),
                        })
                      }
                      aria-label={`第 ${index + 1} 株叶片数`}
                    />
                  </div>
                  <div className={styles.leafColors}>
                    {colors.map((hex, leafIndex) => (
                      <label key={leafIndex} className={styles.leafColor}>
                        <span>叶{leafIndex + 1}</span>
                        <input
                          type="color"
                          value={hex}
                          onChange={(event) =>
                            setLeafColor(index, leafIndex, event.target.value)
                          }
                          aria-label={`第 ${index + 1} 株第 ${leafIndex + 1} 片叶的颜色`}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>活物</h2>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={config.jellyfish}
                onChange={(event) =>
                  setConfig((c) => ({ ...c, jellyfish: event.target.checked }))
                }
              />
              水母
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                checked={config.bubbles}
                onChange={(event) => setConfig((c) => ({ ...c, bubbles: event.target.checked }))}
              />
              气泡
            </label>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>主题预览</h2>
            <div className={styles.segmented} role="group" aria-label="主题预览">
              {[
                { key: 'follow', label: '跟随' },
                { key: 'light', label: '浅色' },
                { key: 'dark', label: '深色' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={previewTheme === item.key ? styles.segmentActive : styles.segment}
                  onClick={() => setPreviewTheme(item.key)}
                  aria-pressed={previewTheme === item.key}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <button type="button" className={styles.reset} onClick={reset}>
            重置
          </button>
        </aside>
      </div>

      <section className={styles.showcase} aria-label="预设陈列">
        <h2 className={styles.showcaseTitle}>灵感陈列</h2>
        <div className={styles.shelf}>
          {PRESETS.map((preset) => (
            <figure key={preset.label} className={styles.preset}>
              <HappinessBottle
                size="sm"
                waterColor={preset.waterColor}
                clovers={preset.clovers}
                jellyfish={preset.jellyfish}
                bubbles={preset.bubbles}
              />
              <figcaption className={styles.presetLabel}>{preset.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
