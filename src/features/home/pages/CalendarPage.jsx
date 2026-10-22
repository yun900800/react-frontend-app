import React, { useMemo, useState } from 'react';
import calendarImage1 from '../../../assets/resources/calendar/1.jpg'
import calendarImage2 from '../../../assets/resources/calendar/2.jpg'
import calendarImage3 from '../../../assets/resources/calendar/3.jpg'
import calendarImage4 from '../../../assets/resources/calendar/4.jpg'
import calendarImage5 from '../../../assets/resources/calendar/5.jpg'
import calendarImage6 from '../../../assets/resources/calendar/6.jpg'
import calendarImage7 from '../../../assets/resources/calendar/7.jpg'
import calendarImage8 from '../../../assets/resources/calendar/8.jpg'
import calendarImage9 from '../../../assets/resources/calendar/9.jpg'
import calendarImage10 from '../../../assets/resources/calendar/10.jpg'
import calendarImage11 from '../../../assets/resources/calendar/11.jpg'
import calendarImage12 from '../../../assets/resources/calendar/12.jpg'
import calendarStyles from './calendar.module.css';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery.js';
import { BookBlock } from '../../books/components/BookReader/BookBlock.jsx';

const MONTH_IMAGES = [
  calendarImage1,
  calendarImage2,
  calendarImage3,
  calendarImage4,
  calendarImage5,
  calendarImage6,
  calendarImage7,
  calendarImage8,
  calendarImage9,
  calendarImage10,
  calendarImage11,
  calendarImage12,
];

// 周一为每周第一天
const WEEKDAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const YEAR_RANGE = 3;
const YEAR_OPTIONS = Array.from(
  { length: YEAR_RANGE * 2 + 1 },
  (_, index) => CURRENT_YEAR - YEAR_RANGE + index,
);

// 事件数据：key 为 `${monthIndex}-${day}`（monthIndex 从 0 开始），便于后续扩展
const CALENDAR_EVENTS = {
  '0-1': '元旦',
};

/**
 * 生成某个月的日期格（周一为第一列）。
 * null 表示该位置的空白格。
 */
function buildMonthCells(year, month) {
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array.from({ length: firstDayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function buildMonthPage(year, month) {
  const cells = buildMonthCells(year, month);
  const rows = [];

  for (let index = 0; index < cells.length; index += 7) {
    rows.push(cells.slice(index, index + 7));
  }

  const rowClass = rows.length === 4
    ? 'fc-four-rows'
    : rows.length === 6
      ? 'fc-six-rows'
      : 'fc-five-rows';

  return (
    <React.Fragment key={`${year}-${month}`}>
      <img
        className={calendarStyles['bb-custom-img']}
        src={MONTH_IMAGES[month]}
        alt={`${year}年${month + 1}月`}
      />
      <div className={calendarStyles['fc-calendar-wrap']}>
        <h2>{year}年{month + 1}月</h2>
        <div className={calendarStyles['fc-calendar-container']}>
          <div className={`${calendarStyles['fc-calendar']} ${calendarStyles[rowClass]}`}>
            <div className={calendarStyles['fc-head']}>
              {WEEKDAY_LABELS.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>
            <div className={calendarStyles['fc-body']}>
              {rows.map((row, rowIndex) => (
                <div className={calendarStyles['fc-row']} key={rowIndex}>
                  {row.map((day, columnIndex) => {
                    if (day === null) {
                      return <div key={columnIndex} />;
                    }

                    const event = CALENDAR_EVENTS[`${month}-${day}`];

                    return (
                      <div key={columnIndex}>
                        <span className={calendarStyles['fc-date']}>{day}</span>
                        <span className={calendarStyles['fc-weekday']}>
                          {WEEKDAY_LABELS[columnIndex]}
                        </span>
                        {event && (
                          <div className={calendarStyles['fc-event']}>{event}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function buildCalendarPages(year) {
  return Array.from({ length: 12 }, (_, month) => buildMonthPage(year, month));
}

function CalendarPage() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [year, setYear] = useState(CURRENT_YEAR);
  const pages = useMemo(() => buildCalendarPages(year), [year]);

  return (
    <div className={calendarStyles['calendar-page']}>
      <div className={calendarStyles['calendar-toolbar']}>
        <label className={calendarStyles['calendar-year-label']} htmlFor="calendar-year">
          年份
        </label>
        <select
          id="calendar-year"
          className={calendarStyles['calendar-select']}
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
        >
          {YEAR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}年
            </option>
          ))}
        </select>
        <span className={calendarStyles['calendar-year-hint']}>
          可选 {YEAR_OPTIONS[0]}–{YEAR_OPTIONS[YEAR_OPTIONS.length - 1]} 年
        </span>
      </div>

      <div className={calendarStyles['calendar-book']}>
        <BookBlock
          pages={pages}
          orientation="horizontal"
          width={isMobile ? '90%' : '480px'}
          height={'600px'}
          initialPage={CURRENT_MONTH}
        />
      </div>
    </div>
  );
}

export default CalendarPage;
