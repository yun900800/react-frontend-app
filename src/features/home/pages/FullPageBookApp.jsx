import React from 'react';
import { BookBlock } from '../../../shared/components/book-block/BookBlock';
import styles from './FullPageBookApp.module.css';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
const pages = [
  <>
  <div className={styles['bb-custom-side']}>
        <p>Soufflé tootsie roll jelly beans. Sweet icing croissant dessert bear claw. Brownie dessert cheesecake danish jelly pudding bear claw soufflé.</p>
    </div>
    <div className={styles['bb-custom-side']}>
        <p>Candy canes lollipop macaroon marshmallow gummi bears tiramisu. Dessert croissant cupcake candy canes. Bear claw faworki faworki lemon drops. Faworki marzipan sugar plum jelly-o marzipan jelly-o.</p>
    </div>
  </>,
  <>
  <div className={styles['bb-custom-side']}>
        <p>Croissant pudding gingerbread gummi bears marshmallow halvah. Wafer donut croissant. Cookie muffin jelly beans pie croissant croissant candy canes jelly marshmallow.</p>
    </div>
    <div className={styles['bb-custom-side']}>
        <p>Wafer donut caramels chocolate caramels sweet roll. Gummi bears powder candy chocolate cake gummi bears icing wafer cupcake. Brownie cotton candy pastry chocolate wypas.</p>
    </div>
  </>,
  <>
  <div className={styles['bb-custom-side']}>
        <p>Marzipan dragée candy canes chocolate cake. Soufflé faworki jelly gingerbread cupcake. Powder gummies applicake.</p>
    </div>
    <div className={styles['bb-custom-side']}>
        <p>Cotton candy caramels tootsie roll soufflé powder lemon drops carrot cake danish. Cotton candy candy canes fruitcake muffin gingerbread. Jujubes soufflé gingerbread donut donut.</p>
    </div>
  </>,
  <>
  <div className={styles['bb-custom-side']}>
        <p>Jujubes fruitcake tiramisu liquorice chocolate cake. Carrot cake faworki donut soufflé oat cake tootsie roll. Fruitcake fruitcake cake sweet pie jelly beans. Chocolate cake candy jujubes oat cake toffee croissant muffin.</p>
    </div>
    <div className={styles['bb-custom-side']}>
        <p>Chocolate bar tiramisu marzipan. Croissant soufflé croissant lollipop liquorice dragée chupa chups carrot cake. Liquorice lollipop halvah toffee lollipop.</p>
    </div>
  </>,
  <>
  <div className={styles['bb-custom-side']}>
        <p>Soufflé tootsie roll jelly beans. Sweet icing croissant dessert bear claw. Brownie dessert cheesecake danish jelly pudding bear claw soufflé.</p>
    </div>
    <div className={styles['bb-custom-side']}>
        <p>Candy canes lollipop macaroon marshmallow gummi bears tiramisu. Dessert croissant cupcake candy canes. Bear claw faworki faworki lemon drops. Faworki marzipan sugar plum jelly-o marzipan jelly-o.</p>
    </div>
  </>
];

const FullPageBookApp = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const orientation = isMobile ? 'horizontal' : 'vertical';
    return (
        <div className={styles['full-page']}>
            <div className={styles['full-main']}>
                <BookBlock pages={pages} width='100%' height='100%' maxWidth='100%' orientation={orientation}/>
            </div>
        </div>
    );
};
export default FullPageBookApp;