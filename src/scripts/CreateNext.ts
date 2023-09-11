import fetch from 'node-fetch';
import jsdom from 'jsdom';

const {JSDOM} = jsdom;
const URL = 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/index.html';
const PREFECTURE_DATA_NUMBER = 0;
const MINIMUM_WAGE_DATA_NUMBER = 1;
const EFFECTIVE_START_DATE_DATA_NUMBER = 3;

(async () => {
  const res = await fetch(URL);
  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const rows = document.querySelectorAll('.m-tableFlex tbody tr');
  rows.forEach((row) => {
    let prefectureDataCell = ''

    if (row.cells[PREFECTURE_DATA_NUMBER].innerHTML === '東京') {
      prefectureDataCell = `${row.cells[PREFECTURE_DATA_NUMBER].innerHTML}都`
    }
    if (row.cells[PREFECTURE_DATA_NUMBER].innerHTML === '京都' || row.cells[PREFECTURE_DATA_NUMBER].innerHTML === '大阪') {
      prefectureDataCell = `${row.cells[PREFECTURE_DATA_NUMBER].innerHTML}府`
    }


    console.log(prefectureDataCell);
    // .map(d => {
    //   if (d === '東京') {
    //     return `${d}都`
    //   }
    //   if (d === '京都' | d === '大阪') {
    //     return `${d}府`
    //   }
    //
    // });
    console.log(prefectureDataCell);
    console.log(row.cells[MINIMUM_WAGE_DATA_NUMBER].innerHTML);
    const effectiveStartDateDataCell = row.cells[EFFECTIVE_START_DATE_DATA_NUMBER];
    if (effectiveStartDateDataCell.children.length > 0) {
      const result = effectiveStartDateDataCell.children[0].innerHTML.match(/\D+(\d+)年(\d+)月(\d+)日/);
      if (!result || !result[1] || !result[2] || !result[3]) {
        return
      }

      console.log(`${Number(result[1]) + 2018}-${Number(result[2])}-${Number(result[3])}`)
    } else {
      // console.log(effectiveStartDateDataCell.innerHTML.match( /\D+(\d+)年(\d+)月(\d+)日/ ));
    }
  })
})();