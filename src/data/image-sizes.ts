/**
 * 사업주체 공개 이미지의 원본 크기(px). <img width/height>로 레이아웃 밀림(CLS)을 줄이는 데만 쓴다.
 * 2026-10-04 원본 파일을 직접 받아 측정. 이미지가 바뀌면 다시 측정해야 한다.
 */
import { img } from "./content";

export const IMAGE_SIZES: Record<string, [number, number]> = {
  [img("/resources/img/sub/overview_apt_img.v4.jpg")]: [982, 1524],
  [img("/resources/img/sub/location_map_img.v4.jpg")]: [1856, 1730],
  [img("/resources/img/sub/brand_content_img.v4.jpg")]: [2600, 2860],
  [img("/resources/img/sub/contact_map_img_1.v4.jpg")]: [1120, 800],
  [img("/resources/img/sub/contact_map_img_2.v4.jpg")]: [1120, 800],
  [img("/resources/img/sub/03_특별공급.v4.jpg")]: [2000, 2930],
  [img("/resources/img/sub/02_일반공급.v4.jpg")]: [2000, 2750],
  [img("/resources/img/sub/01_변경된_청약제도.v4.jpg")]: [2000, 4790],
  [img("/resources/img/pages/main/hero_bg.v4.jpg")]: [1920, 3600],
  [img("/resources/img/common/sub_visual_img.v4.jpg")]: [3840, 780],
  [img("/resources/img/sub/premium_01_img_1.v4.jpg")]: [275, 560],
  [img("/resources/img/sub/premium_02_img_1.v4.jpg")]: [560, 520],
  [img("/resources/img/sub/premium_03_img_1.v4.jpg")]: [485, 239],
  [img("/resources/img/sub/premium_04_img_1.v4.jpg")]: [550, 1120],
  [img("/resources/img/sub/premium_05_img_1.v4.jpg")]: [467, 393],
};
