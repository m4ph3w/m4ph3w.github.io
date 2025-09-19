// ---------- 基礎資料集 ----------
const stems = [
  {k:'甲', w:'木', yin:false},{k:'乙', w:'木', yin:true},{k:'丙', w:'火', yin:false},{k:'丁', w:'火', yin:true},{k:'戊', w:'土', yin:false},
  {k:'己', w:'土', yin:true},{k:'庚', w:'金', yin:false},{k:'辛', w:'金', yin:true},{k:'壬', w:'水', yin:false},{k:'癸', w:'水', yin:true}
];
const branches = [
  {z:'子', w:'水'},{z:'丑', w:'土'},{z:'寅', w:'木'},{z:'卯', w:'木'},{z:'辰', w:'土'},{z:'巳', w:'火'},
  {z:'午', w:'火'},{z:'未', w:'土'},{z:'申', w:'金'},{z:'酉', w:'金'},{z:'戌', w:'土'},{z:'亥', w:'水'}
];
const fiveRel = {
  gen:{'木':'火','火':'土','土':'金','金':'水','水':'木'}, // 生
  ctrl:{'木':'土','土':'水','水':'火','火':'金','金':'木'}, // 克
  same:(a,b)=>a===b,
  relation(a,b){
    if(this.gen[a]===b) return '生';
    if(this.ctrl[a]===b) return '克';
    if(this.gen[b]===a) return '被生';
    if(this.ctrl[b]===a) return '被克';
    if(a===b) return '比和';
    return '無直接關係';
  }
};

// 八卦（三爻自下而上）二進位 0陰 1陽
const trigrams = [
  {code:0,name:'坤',element:'土',symbol:'☷'}, // 000
  {code:1,name:'艮',element:'土',symbol:'☶'}, // 001
  {code:2,name:'坎',element:'水',symbol:'☵'}, // 010
  {code:3,name:'巽',element:'木',symbol:'☴'}, // 011
  {code:4,name:'震',element:'木',symbol:'☳'}, // 100
  {code:5,name:'离',element:'火',symbol:'☲'}, // 101
  {code:6,name:'兑',element:'金',symbol:'☱'}, // 110
  {code:7,name:'乾',element:'金',symbol:'☰'}  // 111
];
const triOrder = ['乾','兑','离','震','巽','坎','艮','坤'];

// 64卦（上×下）名稱表（行=上卦，列=下卦）
const hexNameGrid = [
  ['乾為天','天澤履','天火同人','天雷無妄','天風姤','天水訟','天山遯','天地否'],
  ['澤天夬','兌為澤','澤火革','澤雷隨','澤風大過','澤水困','澤山咸','澤地萃'],
  ['火天大有','火澤睽','離為火','火雷噬嗑','火風鼎','火水未濟','火山旅','火地晉'],
  ['雷天大壯','雷澤歸妹','雷火豐','震為雷','雷風恆','雷水解','雷山小過','雷地豫'],
  ['風天小畜','風澤中孚','風火家人','風雷益','巽為風','風水渙','風山漸','風地觀'],
  ['水天需','水澤節','水火既濟','水雷屯','水風井','坎為水','水山蹇','水地比'],
  ['山天大畜','山澤損','山火賁','山雷頤','山風蠱','山水蒙','艮為山','山地剝'],
  ['地天泰','地澤臨','地火明夷','地雷復','地風升','地水師','地山謙','坤為地']
];

// 經典引文（由輸入鍵控索引，確保可重現）
const classicalQuotes = {
  liuren: [
    {text: '壬課以象為先，四課三傳乃天地人三才之顯現。', source: '《壬歸》'},
    {text: '日辰為體，貴神為用，四課即事之始末。', source: '《六壬大全》'},
    {text: '課傳之中，五行生克為樞機，陰陽變易為妙用。', source: '《六壬斷案》'},
    {text: '以日為君，以辰為臣，以將為佐，使其相得則吉。', source: '《大六壬指南》'}
  ],
  liuyao: [
    {text:'易者，象也。象也者，像也。', source:'《繫辭》'},
    {text:'爻者，言乎變者也。效天下之動者也。', source:'《繫辭》'},
    {text:'卦以存時，爻以示變。', source:'《周易略例》'},
    {text:'剛柔相推，變在其中矣。', source:'《繫辭》'}
  ],
  shefu: [
    {text:'物有其類，事有其象，推而廣之，天下之理得矣。', source:'《梅花易數》'},
    {text:'五行者，天地之性，萬物之綱紀。', source:'《五行大義》'},
    {text:'觀物取象，觸類旁通，聖人之道也。', source:'《繫辭》'},
    {text:'物以類聚，方以群分，吉凶生矣。', source:'《繫辭》'}
  ],
  zhouyi: [
    {text:'易有太極，是生兩儀，兩儀生四象，四象生八卦。', source:'《繫辭》'},
    {text:'夫易，聖人所以極深而研幾也。', source:'《周易本義》'},
    {text:'觀乎天文，以察時變；觀乎人文，以化成天下。', source:'《彖傳》'}
  ]
};

// 八卦類象 / 五行 / 爻位（射覆與表格）
const baguaSymbols = {
  '乾': { nature:'天、冰、雹、霰', human:'父、上司、長輩、領導', body:'首、骨、肺', animal:'馬、天鵝、獅、象', object:'金玉、寶珠、金錢、鏡子、圓物、剛物', attribute:'剛健、貴重、白色、寒冷', element:'金' },
  '坤': { nature:'地、雲、霧、平地', human:'母、妻、農人、眾人', body:'腹、脾、肉、胃', animal:'牛、牝馬、貓、百獸', object:'布帛、五穀、方物、柔物、大車', attribute:'柔順、承載、黃色、厚重', element:'土' },
  '震': { nature:'雷、地震、火山', human:'長男、將帥、商旅', body:'足、肝、發、聲音', animal:'龍、蛇、百蟲、馬鳴', object:'樂器、車輦、木物、竹器、核', attribute:'動、奮起、青色、急劇', element:'木' },
  '巽': { nature:'風、木、雲', human:'長女、僧道、工匠', body:'股、氣、風疾', animal:'雞、禽鳥、百禽、蟲', object:'繩索、竹木、工器、扇、秤', attribute:'入、順從、藍色、飄忽', element:'木' },
  '坎': { nature:'水、雨、溝瀆、井', human:'中男、江湖之人、盜賊', body:'耳、血、腎', animal:'豕、魚、水中物', object:'弓輪、酒器、水具、蒺藜', attribute:'陷、險、黑色、流動', element:'水' },
  '离': { nature:'火、日、電、虹', human:'中女、文人、甲冑之士', body:'目、心、上焦', animal:'雉、龜、蟹、蚌', object:'文書、干戈、槁木、爐', attribute:'麗、明、紅色、炎上', element:'火' },
  '艮': { nature:'山、徑路、石', human:'少男、閒人、童子', body:'手、指、骨、鼻', animal:'虎、鼠、黔喙之屬', object:'門闕、果蓏、土石、瓜', attribute:'止、靜、黃色、穩重', element:'土' },
  '兑': { nature:'澤、水際、池', human:'少女、妾、歌伎', body:'口、舌、肺、痰', animal:'羊、澤中之物', object:'金刃、金器、樂器、廢器', attribute:'悅、口舌、白色、毀折', element:'金' }
};
const wuxingProperties = {
  '金': { nature:'剛硬、鋒利、肅殺、貴重', shape:'圓形、尖銳', color:'白、金、銀', material:'金屬、玉石、晶體', season:'秋', direction:'西' },
  '木': { nature:'生長、柔軟、曲直、條達', shape:'長形、條狀', color:'青、綠', material:'木質、纖維、紙', season:'春', direction:'東' },
  '水': { nature:'流動、寒冷、潤下、智慧', shape:'彎曲、不定形', color:'黑、藍', material:'液體、水晶、玻璃', season:'冬', direction:'北' },
  '火': { nature:'炎上、熱情、光明、文化', shape:'尖形、三角形', color:'紅、紫、橙', material:'電子、能源、塑料', season:'夏', direction:'南' },
  '土': { nature:'承載、厚重、誠信、老舊', shape:'方形、平扁', color:'黃、棕', material:'土質、陶瓷、石頭', season:'季夏', direction:'中' }
};
const yaoPositions = {
  1: { meaning:'開始、基礎、下端', objectPart:'底部、基礎部分' },
  2: { meaning:'漸進、內部、核心', objectPart:'內部結構、主要部分' },
  3: { meaning:'轉折、過渡、變化', objectPart:'連接部分、轉折處' },
  4: { meaning:'上升、外部、輔助', objectPart:'外部特徵、輔助部分' },
  5: { meaning:'尊位、核心、成功', objectPart:'主要功能、核心部分' },
  6: { meaning:'頂端、結束、結果', objectPart:'頂部、末端、裝飾部分' }
};

// ---------- 小工具 ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function hashKey(str){
  if(!str) return 0; let h=0; for(let i=0;i<str.length;i++){ h=(h*31 + str.charCodeAt(i))>>>0; } return h;
}
function pickQuote(type, key){
  const arr = classicalQuotes[type]||[]; if(arr.length===0) return {text:'',source:''};
  const idx = key%arr.length; return arr[idx];
}

// 干支計算
const epoch = new Date('1984-02-02T00:00:00'); // 甲子日（本地時）
function getDayGanzhi(d){
  const ms = d - epoch; const days = Math.floor(ms/86400000);
  const cyc = ((days%60)+60)%60; return { stemIndex: cyc%10, branchIndex: cyc%12 };
}
function getHourBranchIndex(hour){ return Math.floor((hour+1)/2)%12; } // 23點~00點為子
function getHourStemIndex(dayStemIndex, hourBranchIndex){
  const start = [0,2,4,6,8][Math.floor(dayStemIndex/2)]; // 甲己甲、乙庚丙、丙辛戊、丁壬庚、戊癸壬
  return (start + hourBranchIndex)%10;
}
function nearestBranchByElement(fromIndex, targetElement){
  for(let step=1; step<12; step++){
    const idx = (fromIndex + step)%12; if(branches[idx].w===targetElement) return idx;
  }
  return fromIndex;
}

// 畫卦
function renderHex(container, lines){
  container.innerHTML='';
  for(let i=5;i>=0;i--){
    const l = lines[i]; const div=document.createElement('div');
    const isYang = l.isYang; const moving = !!l.isMoving;
    div.className = 'gline ' + (isYang?'yang':'yin') + (moving?' moving':'');
    container.appendChild(div);
  }
}

// 三爻 → 卦名索引
function trigramIndexFromLines(lines3){ // [bottom,mid,top] boolean
  const code = (lines3[0]?1:0) + (lines3[1]?2:0) + (lines3[2]?4:0);
  const tri = trigrams.find(t=>t.code===code); return {code, name: tri.name, element: tri.element, symbol: tri.symbol, idx: triOrder.indexOf(tri.name)};
}
function hexNameByTrigrams(upperName, lowerName){
  const r = triOrder.indexOf(upperName); const c = triOrder.indexOf(lowerName);
  if(r<0||c<0) return '—';
  return hexNameGrid[r][c];
}

// ---------- 標籤切換 ----------
$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    $$('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const id = tab.dataset.tab;
    document.querySelector(`#tab-${id}`).classList.add('active');
  });
});

// ---------- 大六壬：計算 ----------
$('#liurenForm').addEventListener('submit', function(e){ e.preventDefault();
  const dateTime = $('#lrDateTime').value; const location=$('#lrLocation').value; const question=$('#lrQuestion').value;
  if(!dateTime){ alert('請輸入占卜時間'); return; }
  const d = new Date(dateTime);
  const day = getDayGanzhi(d); const hb = getHourBranchIndex(d.getHours()); const hs = getHourStemIndex(day.stemIndex, hb);
  const dayStem = stems[day.stemIndex], dayBranch = branches[day.branchIndex];
  const hourStem = stems[hs], hourBranch = branches[hb];

  // 四課（教學版）
  const lessonTexts = [
    `① 日干 <strong>${dayStem.k}（${dayStem.w}）</strong> ↔ 日支 <strong>${dayBranch.z}（${dayBranch.w}）</strong> → <em>${fiveRel.relation(dayStem.w, dayBranch.w)}</em>`,
    `② 日支 <strong>${dayBranch.z}（${dayBranch.w}）</strong> ↔ 時干 <strong>${hourStem.k}（${hourStem.w}）</strong> → <em>${fiveRel.relation(dayBranch.w, hourStem.w)}</em>`,
    `③ 時干 <strong>${hourStem.k}（${hourStem.w}）</strong> ↔ 時支 <strong>${hourBranch.z}（${hourBranch.w}）</strong> → <em>${fiveRel.relation(hourStem.w, hourBranch.w)}</em>`,
    `④ 日干 <strong>${dayStem.k}（${dayStem.w}）</strong> ↔ 時支 <strong>${hourBranch.z}（${hourBranch.w}）</strong> → <em>${fiveRel.relation(dayStem.w, hourBranch.w)}</em>`
  ].join('<br>');
  $('#lrFourLessons').innerHTML = lessonTexts;

  // 三傳（教學版）
  const chuan1 = hb; // 時支
  const targetMidEle = fiveRel.gen[hourBranch.w];
  const chuan2 = nearestBranchByElement(chuan1, targetMidEle);
  const targetLastEle = fiveRel.gen[dayStem.w];
  const chuan3 = nearestBranchByElement(chuan2, targetLastEle);
  const threeTransIdx = [chuan1, chuan2, chuan3];

  // 繪製十二支盤
  const pan = $('#pan'); pan.innerHTML='';
  branches.forEach((b,idx)=>{
    const div=document.createElement('div'); div.className='branch';
    if(threeTransIdx.includes(idx)) div.classList.add('highlight');
    let marks = [];
    if(idx===day.branchIndex) marks.push('◎');
    if(idx===hb) marks.push('◇');
    const tag = threeTransIdx.indexOf(idx)>=0 ? `<div class="pill" style="margin-top:6px">傳${threeTransIdx.indexOf(idx)+1}</div>` : '';
    div.innerHTML = `<div style="font-size:22px">${b.z} ${marks.join('')}</div><div class="soft">五行:${b.w}</div>${tag}`;
    pan.appendChild(div);
  });

  const transText = `三傳：<strong>${branches[chuan1].z}（${branches[chuan1].w}）</strong> → <strong>${branches[chuan2].z}（${branches[chuan2].w}）</strong> → <strong>${branches[chuan3].z}（${branches[chuan3].w}）</strong>。`;
  $('#lrTrans').innerHTML = `${transText}　此序表現為「${branches[chuan1].w}→${branches[chuan2].w}→${branches[chuan3].w}」之遞生鏈，末傳朝向日干之所需（${targetLastEle}），示利於生扶主體。`;

  // 綜合判讀
  const relDS_HB = fiveRel.relation(dayStem.w, hourBranch.w);
  const relDS_DB = fiveRel.relation(dayStem.w, dayBranch.w);
  const judge = [
    question?`針對「${question}」：`:'',
    `日干為${dayStem.w}，${relDS_DB}日支、${relDS_HB}時支；`,
    threeTransIdx[0]===threeTransIdx[1]&&threeTransIdx[1]===threeTransIdx[2]
      ? '三傳一氣，主事專一，宜速辦。'
      : '三傳遞生，利漸進；若中有相克，則先難後易。'
  ].join(' ');
  $('#lrJudgment').innerHTML = judge;

  const key = hashKey(dateTime + (location||'') + (question||''));
  const q = pickQuote('liuren', key);
  $('#lrQuote').textContent = q.text; $('#lrSource').textContent = q.source;

  $('#liurenResult').style.display='block';
});

// ---------- 六爻：計算 ----------
$('#liuyaoForm').addEventListener('submit', function(e){ e.preventDefault();
  const vals = [1,2,3,4,5,6].map(i=>$('#line'+i).value);
  if(vals.some(v=>!v)){ alert('請完整輸入六爻'); return; }
  const question = $('#lyQuestion').value;
  // 下→上
  const baseLines = vals.map(v=>({ value:v, isYang: v==='7'||v==='9', isMoving: v==='6'||v==='9' }));
  const changedLines = baseLines.map(l=> l.isMoving ? { ...l, isYang: !l.isYang } : { ...l });

  renderHex($('#lyBaseHex'), baseLines);
  renderHex($('#lyChangedHex'), changedLines);

  // 上下卦（本卦）
  const lowerTri = trigramIndexFromLines([baseLines[0].isYang, baseLines[1].isYang, baseLines[2].isYang]);
  const upperTri = trigramIndexFromLines([baseLines[3].isYang, baseLines[4].isYang, baseLines[5].isYang]);
  const baseName = hexNameByTrigrams(upperTri.name, lowerTri.name);
  $('#lyBaseNames').textContent = `上卦：${upperTri.name} ${upperTri.symbol}（${upperTri.element}）　下卦：${lowerTri.name} ${lowerTri.symbol}（${lowerTri.element}）　卦名：${baseName}`;

  // 上下卦（變卦）
  const lowerTriC = trigramIndexFromLines([changedLines[0].isYang, changedLines[1].isYang, changedLines[2].isYang]);
  const upperTriC = trigramIndexFromLines([changedLines[3].isYang, changedLines[4].isYang, changedLines[5].isYang]);
  const changedName = hexNameByTrigrams(upperTriC.name, lowerTriC.name);
  $('#lyChangedNames').textContent = `上卦：${upperTriC.name} ${upperTriC.symbol}　下卦：${lowerTriC.name} ${lowerTriC.symbol}　卦名：${changedName}`;

  // 互卦（2-4、3-5）
  const nuclearLines = [ baseLines[1], baseLines[2], baseLines[3], baseLines[2], baseLines[3], baseLines[4] ].map(l=>({isYang:l.isYang,isMoving:false}));
  renderHex($('#lyNuclearHex'), nuclearLines);
  const lowerTriN = trigramIndexFromLines([nuclearLines[0].isYang, nuclearLines[1].isYang, nuclearLines[2].isYang]);
  const upperTriN = trigramIndexFromLines([nuclearLines[3].isYang, nuclearLines[4].isYang, nuclearLines[5].isYang]);
  const nuclearName = hexNameByTrigrams(upperTriN.name, lowerTriN.name);
  $('#lyNuclearNames').textContent = `上卦：${upperTriN.name} ${upperTriN.symbol}　下卦：${lowerTriN.name} ${lowerTriN.symbol}　卦名：${nuclearName}`;
  $('#lyNuclearInfo').textContent = '由第2~5爻構成';

  const movingIdx = baseLines.map((l,i)=>l.isMoving?i+1:null).filter(Boolean);
  $('#lyBaseInfo').textContent = `動爻: ${movingIdx.length}`;
  $('#lyChangedInfo').textContent = movingIdx.length?`由 ${movingIdx.join('、')} 爻變化而來`:'無變爻';

  const qkey = hashKey(vals.join(',') + (question||''));
  const qq = pickQuote('liuyao', qkey); $('#lyQuote').textContent = qq.text; $('#lySource').textContent = qq.source;

  const trend = movingIdx.length===0? '為靜卦，主穩定守成。'
              : movingIdx.length===1? '一爻動，事有初變。'
              : movingIdx.length<=3? '數爻動，事體漸變。'
              : '多爻並動，變化繁劇，宜審慎。';
  $('#lyAnalysis').innerHTML = `本卦：<strong>${baseName}</strong>；之卦：<strong>${changedName}</strong>；互卦：<strong>${nuclearName}</strong>。${trend}`;

  $('#lyMoving').textContent = movingIdx.length? `動爻位置：${movingIdx.join('、')}。老陰→陽、老陽→陰。` : '無動爻。';

  $('#lyJudgment').innerHTML = `${question?`針對「${question}」：`:''}本卦所示當下態勢，之卦示未來趨向，互卦觀其內在關聯。宜順勢而為，審動爻所涉之層位與卦德（上：外在／後段；下：內在／前段）。`;

  $('#liuyaoResult').style.display='block';
});

// ---------- 射覆：表格與計算 ----------
function fillTriSelects(){
  const triOpts = triOrder.map(n=>`<option value="${n}">${n} ${baguaSymbols[n].element} ${trigrams.find(t=>t.name===n).symbol}</option>`).join('');
  $('#sfUpper').innerHTML = `<option value="">請選擇</option>` + triOpts;
  $('#sfLower').innerHTML = `<option value="">請選擇</option>` + triOpts;
  $('#zyUpperTri').innerHTML = triOpts; $('#zyLowerTri').innerHTML = triOpts;
}
$('#shefuForm').addEventListener('submit', function(e){ e.preventDefault();
  const upper=$('#sfUpper').value, lower=$('#sfLower').value;
  const movingYao = Array.from($('#sfMovingYao').selectedOptions).map(o=>o.value);
  const dateTime=$('#sfDateTime').value; const waiying=$('#sfWaiying').value;
  if(!upper||!lower){ alert('請選擇上卦與下卦'); return; }

  const upperSymbol = baguaSymbols[upper]; const lowerSymbol = baguaSymbols[lower];

  const qkey = hashKey(upper+lower+movingYao.join(',')+(dateTime||'')+(waiying||''));
  const qq = pickQuote('shefu', qkey); $('#sfQuote').textContent = qq.text; $('#sfSource').textContent = qq.source;

  $('#sfBaguaAnalysis').innerHTML = `
    <strong>上卦 ${upper}</strong>（${upperSymbol.attribute}）常見物象：${upperSymbol.object}。<br>
    <strong>下卦 ${lower}</strong>（${lowerSymbol.attribute}）常見物象：${lowerSymbol.object}。
  `;
  $('#sfWuxingAnalysis').innerHTML = `
    <strong>上卦${upperSymbol.element}</strong> — ${wuxingProperties[upperSymbol.element].nature}；形：${wuxingProperties[upperSymbol.element].shape}；色：${wuxingProperties[upperSymbol.element].color}；材：${wuxingProperties[upperSymbol.element].material}。<br>
    <strong>下卦${lowerSymbol.element}</strong> — ${wuxingProperties[lowerSymbol.element].nature}；形：${wuxingProperties[lowerSymbol.element].shape}；色：${wuxingProperties[lowerSymbol.element].color}；材：${wuxingProperties[lowerSymbol.element].material}。
  `;

  let yaoAnalysis = movingYao.length? `動爻：${movingYao.join('、')}。 ` + movingYao.map(y=>`${y}爻→${yaoPositions[y].meaning}（物之${yaoPositions[y].objectPart}）`).join('；') : '無動爻，物品狀態穩定。';
  $('#sfYaoAnalysis').textContent = yaoAnalysis;

  $('#sfCompleteAnalysis').innerHTML = `
    上卦象${upperSymbol.nature.split('、')[0]}、主${upperSymbol.attribute.split('、')[0]}，偏外觀與顏色；下卦象${lowerSymbol.nature.split('、')[0]}、主${lowerSymbol.attribute.split('、')[0]}，偏材質與內裡。<br>
    ${upperSymbol.element===lowerSymbol.element? '上下同五行，性質一致。' : `五行關係：上${upperSymbol.element}與下${lowerSymbol.element} → <em>${fiveRel.relation(upperSymbol.element, lowerSymbol.element)}</em>。`}
  `;

  let timeAnalysis = '未提供時間，略。';
  if(dateTime){
    const dt = new Date(dateTime); const m = dt.getMonth()+1; const h = dt.getHours();
    timeAnalysis = `占時：${m}月${h}時。季節偏${(['冬','冬','春','春','春','夏','夏','夏','秋','秋','秋','冬'])[m-1]}，對${upperSymbol.element}與${lowerSymbol.element}之旺衰可作參考。`;
  }
  $('#sfTimeAnalysis').textContent = timeAnalysis;

  $('#sfWaiyingAnalysis').textContent = waiying? `外應：${waiying}。可作輔助線索。` : '無外應記錄。留意聲光氣味、人物、字詞等觸象。';

  $('#sfJudgment').innerHTML = `
    可能特徵：<br>
    - 外觀傾向：${upperSymbol.attribute.split('、').slice(0,2).join('、')}<br>
    - 內裡傾向：${lowerSymbol.attribute.split('、').slice(0,2).join('、')}<br>
    - 材質候選：${wuxingProperties[upperSymbol.element].material.split('、')[0]} / ${wuxingProperties[lowerSymbol.element].material.split('、')[0]}<br>
    - 主色候選：${wuxingProperties[upperSymbol.element].color.split('、')[0]} / ${wuxingProperties[lowerSymbol.element].color.split('、')[0]}
  `;

  $('#shefuResult').style.display='block';
});

// ---------- 周易：查閱 ----------
function fillZhouyiSelectors(){
  // 六爻輸入欄
  const box = $('#zyLineInputs'); box.innerHTML='';
  for(let i=1;i<=6;i++){
    const row = document.createElement('div'); row.className='line-row';
    const label = document.createElement('label'); label.textContent = (i===1?'初':i===6?'上':['二','三','四','五'][i-2])+'爻';
    const sel = document.createElement('select'); sel.className='line-select'; sel.id='zyL'+i;
    sel.innerHTML = '<option value="">請選擇</option><option value="7">7 少陽(—)</option><option value="8">8 少陰(--)</option><option value="9">9 老陽(動)—</option><option value="6">6 老陰(動)--</option>';
    row.appendChild(label); row.appendChild(sel); box.appendChild(row);
  }
  // 上下卦選擇
  const triOpts = triOrder.map(n=>`<option value="${n}">${n} ${baguaSymbols[n].element} ${trigrams.find(t=>t.name===n).symbol}</option>`).join('');
  $('#zyUpperTri').innerHTML = triOpts; $('#zyLowerTri').innerHTML = triOpts;
  // 名稱選擇（64卦）
  const opts=[]; for(let r=0;r<8;r++){ for(let c=0;c<8;c++){ const nm=hexNameGrid[r][c]; opts.push(`<option value="${r},${c}">${nm}</option>`); } }
  $('#zyNameSelect').innerHTML = opts.join('');
}
function zyRenderByLines(lines){
  const baseLines = lines.map(v=>({ value:v, isYang: v==='7'||v==='9', isMoving: v==='6'||v==='9' }));
  renderHex($('#zyHex'), baseLines);
  const lowerTri = trigramIndexFromLines([baseLines[0].isYang, baseLines[1].isYang, baseLines[2].isYang]);
  const upperTri = trigramIndexFromLines([baseLines[3].isYang, baseLines[4].isYang, baseLines[5].isYang]);
  const name = hexNameByTrigrams(upperTri.name, lowerTri.name);
  $('#zyHexName').textContent = name;
  $('#zyNames').textContent = `上卦：${upperTri.name} ${upperTri.symbol}（${upperTri.element}）　下卦：${lowerTri.name} ${lowerTri.symbol}（${lowerTri.element}）`;
  $('#zyInfo').textContent = '六爻輸入構成';

  const nuclearLines = [ baseLines[1], baseLines[2], baseLines[3], baseLines[2], baseLines[3], baseLines[4] ].map(l=>({isYang:l.isYang,isMoving:false}));
  renderHex($('#zyNuclearHex'), nuclearLines);
  const lowerTriN = trigramIndexFromLines([nuclearLines[0].isYang, nuclearLines[1].isYang, nuclearLines[2].isYang]);
  const upperTriN = trigramIndexFromLines([nuclearLines[3].isYang, nuclearLines[4].isYang, nuclearLines[5].isYang]);
  const nuclearName = hexNameByTrigrams(upperTriN.name, lowerTriN.name);
  $('#zyNuclearNames').textContent = `上卦：${upperTriN.name} ${upperTriN.symbol}　下卦：${lowerTriN.name} ${lowerTriN.symbol}　卦名：${nuclearName}`;
  $('#zyNuclearInfo').textContent = '由第2~5爻構成';

  const q = pickQuote('zhouyi', hashKey(lines.join(','))); $('#zyQuote').textContent = q.text; $('#zySource').textContent = q.source;
  $('#zySummary').textContent = '本模塊呈現結構信息（卦名、上下卦、互卦）。若需占驗，請依具體流派之納甲、用神、日月建、世應等法處理。';
  $('#zhouyiResult').style.display='block';
}
$('#zyLinesForm').addEventListener('submit', function(e){ e.preventDefault();
  const vals = [1,2,3,4,5,6].map(i=>$('#zyL'+i).value); if(vals.some(v=>!v)){ alert('請完整輸入六爻'); return; }
  zyRenderByLines(vals);
});
$('#zyTriForm').addEventListener('submit', function(e){ e.preventDefault();
  const up=$('#zyUpperTri').value, low=$('#zyLowerTri').value;
  function triLines(name){ const t = trigrams.find(tt=>tt.name===name); const code=t.code; return [ (code&1)>0, (code&2)>0, (code&4)>0 ]; }
  const lines = [...triLines(low), ...triLines(up)].map(b=>b?'7':'8');
  zyRenderByLines(lines); $('#zyInfo').textContent = '由上下卦構成';
});
$('#zyNameForm').addEventListener('submit', function(e){ e.preventDefault();
  const [r,c] = $('#zyNameSelect').value.split(',').map(n=>parseInt(n));
  const up = triOrder[r], low = triOrder[c];
  function triLines(name){ const t = trigrams.find(tt=>tt.name===name); const code=t.code; return [ (code&1)>0, (code&2)>0, (code&4)>0 ]; }
  const lines = [...triLines(low), ...triLines(up)].map(b=>b?'7':'8');
  zyRenderByLines(lines); $('#zyInfo').textContent = '由卦名查得';
});

// ---------- 表格渲染（射覆） ----------
function renderBaguaTable(){
  const table = document.createElement('table'); table.className='reference-table';
  table.innerHTML = `<thead><tr><th>卦名</th><th>自然</th><th>人倫</th><th>身體</th><th>動物</th><th>物品</th><th>屬性</th></tr></thead>`;
  const tb = document.createElement('tbody');
  triOrder.forEach(n=>{
    const b = baguaSymbols[n];
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${n} ${trigrams.find(t=>t.name===n).symbol}</td><td>${b.nature}</td><td>${b.human}</td><td>${b.body}</td><td>${b.animal}</td><td>${b.object}</td><td>${b.attribute}</td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb); $('#baguaTableWrap').innerHTML=''; $('#baguaTableWrap').appendChild(table);
}
function renderWuxingTable(){
  const table = document.createElement('table'); table.className='reference-table';
  table.innerHTML = `<thead><tr><th>五行</th><th>性質</th><th>形狀</th><th>顏色</th><th>材質</th><th>季節</th><th>方位</th></tr></thead>`;
  const tb = document.createElement('tbody');
  Object.keys(wuxingProperties).forEach(k=>{
    const w=wuxingProperties[k];
    const tr=document.createElement('tr'); tr.innerHTML = `<td>${k}</td><td>${w.nature}</td><td>${w.shape}</td><td>${w.color}</td><td>${w.material}</td><td>${w.season}</td><td>${w.direction}</td>`;
    tb.appendChild(tr);
  });
  table.appendChild(tb); $('#wuxingTableWrap').innerHTML=''; $('#wuxingTableWrap').appendChild(table);
}
function fillYaoTable(){
  const body=$('#yaoTableBody'); body.innerHTML='';
  for(let i=1;i<=6;i++){
    const y=yaoPositions[i]; const tr=document.createElement('tr'); tr.innerHTML=`<td>${i===1?'初':i===6?'上':['二','三','四','五'][i-2]}爻</td><td>${y.meaning}</td><td>${y.objectPart}</td>`; body.appendChild(tr);
  }
}

// ---------- 主題切換 ----------
const THEME_KEY = 'oracle-theme';
function loadTheme(){ return localStorage.getItem(THEME_KEY) || 'dark'; }
function saveTheme(v){ localStorage.setItem(THEME_KEY, v); }
function applyTheme(v){ document.documentElement.setAttribute('data-theme', v); }
$('#toggleTheme').addEventListener('click', ()=>{
  const cur = loadTheme(); const nxt = cur === 'dark' ? 'light' : 'dark';
  saveTheme(nxt); applyTheme(nxt);
});

// ---------- 初始化 ----------
(function init(){
  applyTheme(loadTheme());
  $('#year').textContent = new Date().getFullYear();
  // 射覆/周易選單與表格
  fillTriSelects(); renderBaguaTable(); renderWuxingTable(); fillYaoTable();
  // 周易
  fillZhouyiSelectors();
})();
