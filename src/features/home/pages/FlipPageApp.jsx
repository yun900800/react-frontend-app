import React from "react";
import { FlipBook } from "../components/FlipBook";
import styles from "./FlipPageApp.module.css";

export const FlipPageApp = () => {
  // const sampleText = `
  //   Chapter 1. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
  //   Chapter 2. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
  //   Chapter 3. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 4. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
  //   Chapter 5. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
  //   Chapter 6. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 7. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 8. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.

  //   Chapter 9. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.

  //   Chapter 10. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 1. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
  //   Chapter 2. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
  //   Chapter 3. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 4. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
  //   Chapter 5. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
  //   Chapter 6. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 7. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

  //   Chapter 8. The Beginning.
  //   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
  //   Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
  //   Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
  //   Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
  //   Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.

  //   Chapter 9. The Journey.
  //   Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
  //   Donec in est vitae sem pretium fermentum.
  //   Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.

  //   Chapter 10. The End.
  //   Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.
  // `;
//   const flipBookCommentData = `
// 第1章 终极孤独的宿命
// 布恩迪亚家族的人不断失败的原因之一正好是孤独。
// 加西亚·马尔克斯本人曾言，这是他作品的核心主题。
// 整个家族沉浸在自我隔绝的状态，最终导致了马孔多的衰亡。

// 第2章 时间的循环与回归
// 书中的宿命论暗喻了古往今来导致历史不断重复的意识形态。
// 拉丁美洲的历史被解读成一个永恒的循环。
// 每一次新的开始，都不过是上一次悲剧的重新上演。

// 第3章 魔幻现实主义的艺术
// 被认为是魔幻现实主义小说的经典杰作。
// 它完美地运用艺术手法，把真实的人物放置于荒诞离奇的魔幻之境。
// 魔法不是超自然现象，而是一种平静的、日常的生活方式。

// 第4章 宏大的家族史诗
// 七代人的兴衰历程，是人类欲望与命运抗争的缩影。
// 家族的谱系图成为理解小说结构的关键。
// 每一个重复的名字，都承载着前人的失败和希望。

// 第5章 爱情与苦恼的解药
// “爱情的苦恼只有在床上才能解除。” 
// 小说中的爱情往往是炽热、短暂而又充满毁灭性的。
// 它既是生命的火花，也是孤独的诱因。

// 第6章 对极权与暴力的批判
// 香蕉园大屠杀是小说中极权统治与暴力压迫的象征。
// 被遗忘的历史，是统治者对记忆的清除。
// 马尔克斯以此揭露了拉丁美洲的政治创伤。

// 第7章 记忆与遗忘的战争
// “他把所有回忆都装进了盒子，他担心它们跑掉。”
// 马孔多的失眠症，象征着集体记忆的丧失。
// 记忆的不可靠性，使得真实与虚构的界限模糊。

// 第8章 预言与梅尔基亚德斯的手稿
// 吉卜赛人梅尔基亚德斯的手稿，是贯穿始终的预言。
// 整部小说的结局早已被预言所规定。
// 手稿的最终解码，揭示了布恩迪亚家族的必然结局。

// 第9章 伟大的开篇与震撼的结尾
// “多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会想起他父亲带他去见识冰块的那个遥远的下午。”
// 这句开篇是文学史上最伟大的开头之一。
// 结尾则暗示了人类在永恒的时间面前的微不足道。

// 第10章 文学史上的地位与影响
// 《百年孤独》是 20 世纪最伟大的西班牙语文学作品之一。
// 它为拉丁美洲文学赢得了世界性的声誉。
// 它不仅是一部小说，更是对整个拉美大陆历史与精神的深刻反思。
// `;

const flipBookCommentData = [
  `第1章 终极孤独的宿命
布恩迪亚家族的人不断失败的原因之一正好是孤独。
加西亚·马尔克斯本人曾言，这是他作品的核心主题。
整个家族沉浸在自我隔绝的状态，最终导致了马孔多的衰亡。`,

  `第2章 时间的循环与回归
书中的宿命论暗喻了古往今来导致历史不断重复的意识形态。
拉丁美洲的历史被解读成一个永恒的循环。
每一次新的开始，都不过是上一次悲剧的重新上演。`,

  `第3章 魔幻现实主义的艺术
被认为是魔幻现实主义小说的经典杰作。
它完美地运用艺术手法，把真实的人物放置于荒诞离奇的魔幻之境。
魔法不是超自然现象，而是一种平静的、日常的生活方式。`,

  `第4章 宏大的家族史诗
七代人的兴衰历程，是人类欲望与命运抗争的缩影。
家族的谱系图成为理解小说结构的关键。
每一个重复的名字，都承载着前人的失败和希望。`,

  `第5章 爱情与苦恼的解药
“爱情的苦恼只有在床上才能解除。”
小说中的爱情往往是炽热、短暂而又充满毁灭性的。
它既是生命的火花，也是孤独的诱因。`,

  `第6章 对极权与暴力的批判
香蕉园大屠杀是小说中极权统治与暴力压迫的象征。
被遗忘的历史，是统治者对记忆的清除。
马尔克斯以此揭露了拉丁美洲的政治创伤。`,

  `第7章 记忆与遗忘的战争
“他把所有回忆都装进了盒子，他担心它们跑掉。”
马孔多的失眠症，象征着集体记忆的丧失。
记忆的不可靠性，使得真实与虚构的界限模糊。`,

  `第8章 预言与梅尔基亚德斯的手稿
吉卜赛人梅尔基亚德斯的手稿，是贯穿始终的预言。
整部小说的结局早已被预言所规定。
手稿的最终解码，揭示了布恩迪亚家族的必然结局。`,

  `第9章 伟大的开篇与震撼的结尾
“多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会想起他父亲带他去见识冰块的那个遥远的下午。”
这句开篇是文学史上最伟大的开头之一。
结尾则暗示了人类在永恒的时间面前的微不足道。`,

  `第10章 文学史上的地位与影响
《百年孤独》是 20 世纪最伟大的西班牙语文学作品之一。
它为拉丁美洲文学赢得了世界性的声誉。
它不仅是一部小说，更是对整个拉美大陆历史与精神的深刻反思。`,
];

const reviews = JSON.parse(localStorage.getItem("bookReviews"));
const content = (reviews || flipBookCommentData).map(r => r.content);
  const bookTitle = <>
    <h2>百年孤独</h2>
    <a 
      className={styles['image-container']}>
        <img className={styles['image-content']} src="https://img2.baidu.com/it/u=383746392,1596704272&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1153">
        </img>
    </a>
  </>
  return (
    <div className={styles["full-page"]}>
      <div className={styles["full-main"]}>
        <FlipBook 
        content={content || flipBookCommentData} 
        bookTitle={bookTitle}
        endTitle="孤独是人生的常态" 
        mode="comment"
        />
      </div>
    </div>
  );
};
