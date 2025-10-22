import React from 'react';
import { BookList } from '../../../shared/components/3d-book/BookList';
import styles from './FullPageApp.module.css';
import imageBack from '../../../assets/resources/3d-book-images/3.png'
const booksData = [
  {
    id: 1,
    coverColor: "#ff924a",
    title: "A Catwork Orange",
    author: "Anthony Burghiss",
    coverBackText: "这是旋转背面内容", // bk-cover-back 的内容
    pages: [
      { id: 1, content: "Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano dolphinfish carp large-eye bream, squeaker amago. Sandroller; rough scad, tiger shovelnose catfish snubnose parasitic eel? Black bass soldierfish duckbill--Rattail Atlantic saury Blind shark California halibut; false trevally warty angler!" },
      { id: 2, content: "Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel rock bass whiff murray cod. Bigmouth buffalo ling cod giant wels, sauger pink salmon. Clingfish luderick treefish flatfish Cherubfish oldwife Indian mul gizzard shad hagfish zebra danio. Butterfly ray lizardfish ponyfish muskellunge Long-finned sand diver mullet swordfish limia ghost carp filefish." },
      { id: 3, content: "Red snapper Kafue pike fangtooth humums's slipmouth, salmon cutlassfish; swallower European perch mola mola sunfish, threadfin bream. Billfish hog sucker trout-perch lenok orbicular velvetfish. Delta smelt striped bass, medusafish dragon goby starry flounder cuchia round whitefish northern anchovy spadefish merluccid hake cat shark Black pickerel. Pacific cod." },
    ],
    backCoverSummary: "Tyrant, blackmailer, racketeer, murderer - his influence reaches every level of American society. Meet Cat Corleone, a friendly cat, a just cat, a reasonable cat. The deadliest lord of the Cata Nostra. The Catfather.", // bk-back 的内容
    infoSummary: "A modern masterpiece,The Godfather is a searing portrayal of the 1940s criminal underworld. It is also the intimate story of the Corleone family, at once drawn together and ripped apart by its unique position at the core of the American Mafia.", // bk-info 的内容
  },
  {
    id: 2,
    coverColor: "#222",
    title: "The Catfather",
    author: "Mario Purrzo",
    // ... 其他书籍数据
  },
  {
    id: 3,
    coverColor: "#a4c19e",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 1,
    coverColor: "#cfa6ef",
    title: "A Catwork Orange",
    author: "Anthony Burghiss",
    coverBackText: "这是旋转背面内容", // bk-cover-back 的内容
    pages: [
      { id: 1, content: "Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano dolphinfish carp large-eye bream, squeaker amago. Sandroller; rough scad, tiger shovelnose catfish snubnose parasitic eel? Black bass soldierfish duckbill--Rattail Atlantic saury Blind shark California halibut; false trevally warty angler!" },
      { id: 2, content: "Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel rock bass whiff murray cod. Bigmouth buffalo ling cod giant wels, sauger pink salmon. Clingfish luderick treefish flatfish Cherubfish oldwife Indian mul gizzard shad hagfish zebra danio. Butterfly ray lizardfish ponyfish muskellunge Long-finned sand diver mullet swordfish limia ghost carp filefish." },
      { id: 3, content: "Red snapper Kafue pike fangtooth humums's slipmouth, salmon cutlassfish; swallower European perch mola mola sunfish, threadfin bream. Billfish hog sucker trout-perch lenok orbicular velvetfish. Delta smelt striped bass, medusafish dragon goby starry flounder cuchia round whitefish northern anchovy spadefish merluccid hake cat shark Black pickerel. Pacific cod." },
    ],
    backCoverSummary: "Tyrant, blackmailer, racketeer, murderer - his influence reaches every level of American society. Meet Cat Corleone, a friendly cat, a just cat, a reasonable cat. The deadliest lord of the Cata Nostra. The Catfather.", // bk-back 的内容
    infoSummary: "A modern masterpiece,The Godfather is a searing portrayal of the 1940s criminal underworld. It is also the intimate story of the Corleone family, at once drawn together and ripped apart by its unique position at the core of the American Mafia.", // bk-info 的内容
  },
  {
    id: 2,
    coverColor: "#FFC2CE",
    title: "The Catfather",
    author: "Mario Purrzo",

    // ... 其他书籍数据
  },
  {
    id: 3,
    coverColor: "#80B3FF",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 1,
    coverColor: "#FD6E8A",
    title: "A Catwork Orange",
    author: "Anthony Burghiss",
    coverBackText: "这是旋转背面内容", // bk-cover-back 的内容
    pages: [
      { id: 1, content: "Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano dolphinfish carp large-eye bream, squeaker amago. Sandroller; rough scad, tiger shovelnose catfish snubnose parasitic eel? Black bass soldierfish duckbill--Rattail Atlantic saury Blind shark California halibut; false trevally warty angler!" },
      { id: 2, content: "Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel rock bass whiff murray cod. Bigmouth buffalo ling cod giant wels, sauger pink salmon. Clingfish luderick treefish flatfish Cherubfish oldwife Indian mul gizzard shad hagfish zebra danio. Butterfly ray lizardfish ponyfish muskellunge Long-finned sand diver mullet swordfish limia ghost carp filefish." },
      { id: 3, content: "Red snapper Kafue pike fangtooth humums's slipmouth, salmon cutlassfish; swallower European perch mola mola sunfish, threadfin bream. Billfish hog sucker trout-perch lenok orbicular velvetfish. Delta smelt striped bass, medusafish dragon goby starry flounder cuchia round whitefish northern anchovy spadefish merluccid hake cat shark Black pickerel. Pacific cod." },
    ],
    backCoverSummary: "Tyrant, blackmailer, racketeer, murderer - his influence reaches every level of American society. Meet Cat Corleone, a friendly cat, a just cat, a reasonable cat. The deadliest lord of the Cata Nostra. The Catfather.", // bk-back 的内容
    infoSummary: "A modern masterpiece,The Godfather is a searing portrayal of the 1940s criminal underworld. It is also the intimate story of the Corleone family, at once drawn together and ripped apart by its unique position at the core of the American Mafia.", // bk-info 的内容
  },
  {
    id: 2,
    coverColor: "#A2122F",
    title: "The Catfather",
    author: "Mario Purrzo",
    // ... 其他书籍数据
  },
  {
    id: 3,
    coverColor: "#439877",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 1,
    coverColor: "#5E445D",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 2,
    coverColor: "#A8936D",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 3,
    coverColor: "#439877",
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
  {
    id: 1,
    coverColor: "#FD6E8A",
    title: "A Catwork Orange",
    author: "Anthony Burghiss",
    coverBackText: "这是旋转背面内容", // bk-cover-back 的内容
    pages: [
      { id: 1, content: "Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano dolphinfish carp large-eye bream, squeaker amago. Sandroller; rough scad, tiger shovelnose catfish snubnose parasitic eel? Black bass soldierfish duckbill--Rattail Atlantic saury Blind shark California halibut; false trevally warty angler!" },
      { id: 2, content: "Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel rock bass whiff murray cod. Bigmouth buffalo ling cod giant wels, sauger pink salmon. Clingfish luderick treefish flatfish Cherubfish oldwife Indian mul gizzard shad hagfish zebra danio. Butterfly ray lizardfish ponyfish muskellunge Long-finned sand diver mullet swordfish limia ghost carp filefish." },
      { id: 3, content: "Red snapper Kafue pike fangtooth humums's slipmouth, salmon cutlassfish; swallower European perch mola mola sunfish, threadfin bream. Billfish hog sucker trout-perch lenok orbicular velvetfish. Delta smelt striped bass, medusafish dragon goby starry flounder cuchia round whitefish northern anchovy spadefish merluccid hake cat shark Black pickerel. Pacific cod." },
    ],
    backCoverSummary: "Tyrant, blackmailer, racketeer, murderer - his influence reaches every level of American society. Meet Cat Corleone, a friendly cat, a just cat, a reasonable cat. The deadliest lord of the Cata Nostra. The Catfather.", // bk-back 的内容
    infoSummary: "A modern masterpiece,The Godfather is a searing portrayal of the 1940s criminal underworld. It is also the intimate story of the Corleone family, at once drawn together and ripped apart by its unique position at the core of the American Mafia.", // bk-info 的内容
  }
];

export const FullPageApp = () => {
    return (
        <div className={styles['full-page']}>
            <div className={styles['full-main']}>
                <BookList books={booksData} viewMode='shelf'/>
            </div>
        </div>
    );
};