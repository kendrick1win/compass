import OpenAI from "openai";
import BaziConverter from "@/lib/bazi-converter";

let bazi = new BaziConverter(2003, 11, 24, 7);

//returns { year: '癸酉', month: '丁巳', day: '辛卯', time: '戊戌' }
console.log(bazi.getBaziJson());

/* returns the English mapping of the Bazi result
    {
      year: 'Metal Rooster',
      month: 'Fire Snake',
      day: 'Wood Rabbit',
      time: 'Earth Dog'
    }
*/
console.log(bazi.translateBaziEnglish());

//returns 癸酉年丁巳月辛卯日戊戌时
console.log(bazi.getBaziChineseFullString());
