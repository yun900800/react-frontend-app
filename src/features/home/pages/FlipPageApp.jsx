import React from "react";
import { FlipBook } from "../components/FlipBook";
import styles from "./FlipPageApp.module.css";

export const FlipPageApp = () => {
  const sampleText = `
    Chapter 1. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 2. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 3. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 4. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 5. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 6. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 7. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 8. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.

    Chapter 9. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.

    Chapter 10. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 1. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 2. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 3. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 4. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 5. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 6. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 7. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 8. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.

    Chapter 9. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.

    Chapter 10. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.
  `;
//   const sampleText = `
// 第1章 开始  
// 很久很久以前，在一座安静的小镇上，阳光透过树叶洒在青石路上，空气中弥漫着面包的香气。  
// 艾琳每天清晨都会走过那条街，她的心中总有一股难以名状的悸动。  
// 那一天，她在书店门口停下了脚步，翻开了一本泛黄的旧书——故事，从这里开始。

// 第2章 旅程  
// 一场突如其来的雨打乱了她的计划。  
// 她撑着伞，走在模糊的街道上，思绪被带往远方。  
// “也许，这就是命运吧。”她轻声说道。  
// 于是，她决定启程，去寻找那份藏在记忆深处的答案。

// 第3章 终章  
// 旅途漫长，风雨交加。  
// 她看过无数的日出，也失去了无数的方向。  
// 但在山谷的尽头，她终于看到了光。  
// 那光不是太阳，而是自己内心的宁静。

// 第4章 开始  
// 新的城市，新的街道。  
// 人群中，她再一次看到了那本书的封面。  
// “似曾相识的感觉……”她喃喃自语。  
// 她翻开第一页，文字依然温暖如初。

// 第5章 旅程  
// 这一次，她不再害怕孤独。  
// 她学会了与自己对话，学会了倾听风的声音。  
// 世界很大，但她的脚步更加坚定。  
// 每一次停留，都是下一段故事的伏笔。

// 第6章 终章  
// 月光洒在窗台上，纸页轻轻翻动。  
// 她合上书，微微一笑。  
// “原来我一直在寻找的，就是现在。”  
// 故事似乎结束了，又似乎刚刚开始。

// 第7章 尾声  
// 岁月流转，故事在她心中留下了温柔的痕迹。  
// 那本旧书已泛黄，但其中的文字依然鲜活。  
// 有些结局，不需要言语，就能被时间温柔地理解。

// 第8章 开始  
// 晨光穿过窗帘，新的日子又到来了。  
// 她拿起笔，写下新的篇章。  
// 这一次，她决定为自己而活，  
// 不再害怕风雨，不再逃避明天。

// 第9章 旅程  
// 她走遍山川湖海，遇见不同的面孔。  
// 每一张笑脸，都是生命送来的礼物。  
// 她开始相信，人生的意义从不在终点，  
// 而在每一次勇敢的迈步之间。

// 第10章 终章  
// 当夜幕再次降临，她坐在书桌前，  
// 轻轻翻开那本写满回忆的笔记。  
// “结束并不可怕，”她想，  
// “因为每一个结尾，都是另一个开始。”  
// `;


  return (
    <div className={styles["full-page"]}>
      <div className={styles["full-main"]}>
        <FlipBook content={sampleText} />
      </div>
    </div>
  );
};
