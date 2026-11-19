const STOCKS=[
 {code:'SWE',name:'삼성우전자',sector:'IT·반도체',icon:'▦',price:45000,description:'AI 서버와 첨단 반도체를 생산하는 기업'},
 {code:'SKH',name:'SK하이재하',sector:'IT·반도체',icon:'◈',price:62000,description:'고성능 메모리와 산업용 반도체 전문 기업'},
 {code:'UNI',name:'유혜니클로',sector:'의류·패션',icon:'♧',price:18000,description:'합리적인 가격의 글로벌 캐주얼 의류 기업'},
 {code:'PAT',name:'파타고미나',sector:'의류·패션',icon:'◬',price:27000,description:'기능성 의류 및 아웃도어 브랜드'},
 {code:'POR',name:'포르승재',sector:'자동차·모빌리티',icon:'◆',price:55000,description:'프리미엄 전기차와 차세대 모빌리티 기업'},
 {code:'HYU',name:'경현대자동차',sector:'자동차·모빌리티',icon:'▱',price:38000,description:'글로벌 완성차 및 전기차 생산 기업'},
 {code:'HKG',name:'현근당',sector:'바이오·제약',icon:'✚',price:24000,description:'의약품 및 신약 연구개발 기업'},
 {code:'SBS',name:'삼성바이오새로직스',sector:'바이오·제약',icon:'✧',price:72000,description:'바이오의약품 위탁생산·연구개발 기업'}
];
const SECTORS=['IT·반도체','의류·패션','자동차·모빌리티','바이오·제약'];
const NEWS=[
 {title:'AI가 전기를 다 쓴다? 전력 우선 공급의 향방',intro:'AI 데이터센터의 전력 수요가 급증하면서 주요 전력회사가 공급 우선순위를 결정할 예정입니다. 데이터센터의 성장과 기존 공장의 생산 안정성 사이에서 어떤 선택을 내릴까요?',options:['AI 데이터센터 우선 공급','일반 산업 공장 우선 공급'],results:['AI 데이터센터에 전력 우선 공급 확정','일반 산업 공장에 전력 우선 공급 확정'],img:'assets/news-1.webp'},
 {title:'미국 대통령 선거, 새로운 대통령은 누구?',intro:'미국의 가상 대통령 선거 개표가 임박했습니다. 기업 규제 완화와 제조업 지원을 강조하는 후보 A, 친환경·복지 산업 육성을 내세운 후보 B가 맞붙습니다.',options:['후보 A · 규제 완화 및 제조업 투자 확대','후보 B · 친환경·복지 및 의료·소비 지원'],results:['기업 규제 완화·제조업 지원 후보 A 당선','친환경·복지 산업 육성 후보 B 당선'],img:'assets/news-2.webp'},
 {title:'외국인, 한국 주식시장에 100조 원 투자!',intro:'글로벌 대형 투자기관들이 국내 증시에 가상의 투자금 100조 원을 배분합니다. 4개 산업 중 무작위로 선정되는 2~3개 산업에 신규 투자금을 집중하고, 나머지 산업은 기존 보유 비중을 줄일 예정입니다. 투자 대상과 배분 결과는 주문 마감 후 공개됩니다.',options:['2~3개 산업에 분산 투자 (구체적 투자 대상 비공개)'],results:[],img:'assets/news-3.webp'},
 {title:'원·달러 환율, 급등일까 급락일까?',intro:'국제 금융시장의 움직임으로 원·달러 환율이 크게 변동할 전망입니다. 수출 대금과 해외 원자재·장비 수입 비용이 함께 달라질 수 있어 국내 산업계가 주목하고 있습니다.',options:['원·달러 환율 상승 · 원화 약세','원·달러 환율 하락 · 원화 강세'],results:['원·달러 환율 상승, 원화 가치 하락','원·달러 환율 하락, 원화 가치 상승'],img:'assets/news-4.webp'}
];
const msgRanges=[{min:1,max:1,title:'월스트리트가 당신을 찾습니다.',sub:'ECONIGHT INVEST의 전설적인 투자자 탄생!'},{min:2,max:2,title:'워런 버핏도 긴장할 실력!',sub:'정상까지 단 한 걸음이었습니다.'},{min:3,max:3,title:'여의도의 떠오르는 별!',sub:'당신의 투자 감각, 인정합니다.'},{min:4,max:5,title:'증권사에서 연락 올지도?',sub:'TOP 5에 이름을 올린 투자 고수!'},{min:6,max:10,title:'개미인 줄 알았더니 큰손이었네?',sub:'당당하게 TOP 10 진입 성공!'},{min:11,max:20,title:'경제학과 짬바 어디 안 가네!',sub:'시장을 읽는 감각이 제법인데요?'},{min:21,max:30,title:'시장과 치열한 심리전 한 판!',sub:'4번의 라운드를 멋지게 완주했습니다.'},{min:31,max:40,title:'워런 버핏도 처음엔 초보였다!',sub:'오늘은 경험을, 다음에는 수익을!'},{min:41,max:50,title:'주식시장은 원래 반전 드라마!',sub:'다음 시즌의 주인공은 당신일지도?'}];
const INITIAL_CASH=1000000;
const STORAGE_KEY='econight-participant-demo-v4';
const $=id=>document.getElementById(id);
const won=v=>Math.round(v).toLocaleString('ko-KR')+'원';
const pct=v=>(v>0?'+':'')+v.toFixed(2)+'%';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stateDefaults=()=>({name:'',page:'welcome',round:0,phase:'WAITING',cash:INITIAL_CASH,holdings:{},prices:STOCKS.map(s=>s.price),changes:STOCKS.map(()=>0),orders:[],results:[],outcome:null,rankings:[]});
let state=stateDefaults(),orderQuantities=Array(8).fill(1),sectorFilter='전체',submitting=false;
try{let saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(saved&&Array.isArray(saved.prices)&&saved.prices.length===8)state={...state,...saved}}catch{}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2700)}
function move(page){state.page=page;persist();
render();


scrollTo({top:0,behavior:'instant'})}
function company(idx){const s=STOCKS[idx];return {...s,index:idx,current:state.prices[idx],change:state.changes[idx],held:state.holdings[s.code]||0}}
function account(){const invested=state.prices.reduce((sum,p,i)=>sum+p*(state.holdings[STOCKS[i].code]||0),0);return{total:state.cash+invested,invested,rate:(state.cash+invested-INITIAL_CASH)/INITIAL_CASH*100}}
function brand(tag){return `<div class="head"><div class="smallbrand"><span class="logo">↗</span><div class="brand">ECONIGHT <span>INVEST</span></div></div><span class="pill">${esc(tag)}</span></div>`}

function footer(label, action, disabled = false, extra = '') {
  // 시연용 진행 버튼은 실제 대회에서 표시하지 않음
  if (action.startsWith('demo-') || action === 'reset') {
    return `
      <div class="bottom">
        <p class="bottom-note">
          운영진의 다음 진행을 기다려 주세요.
        </p>
      </div>
    `;
  }

  // 규칙 확인 등 일반 이동 버튼은 유지
  return `
    <div class="bottom">
      ${extra}
      <button
        class="btn"
        data-action="${action}"
        ${disabled ? 'disabled' : ''}
      >
        ${label}
      </button>
    </div>
  `;
}

function page(html,foot=''){return `<div class="app"><main class="page">${html}</main>${foot}</div>`}
function intro(){return `<div class="app"><main class="welcome"><div class="welogo"><div class="symbol" aria-hidden="true">↗▂▅▇</div><h1>ECONIGHT<br><b>INVEST</b></h1><p>2026 경제인의 밤<br>모의투자 대회</p></div><form id="name-form"><label for="username"><b>참가자 이름</b></label><input id="username" class="name-field" placeholder="이름을 입력해 주세요" autocomplete="name" maxlength="20" required value="${esc(state.name)}"><button type="submit" class="btn">시작하기　›</button></form><p class="muted-mini" style="text-align:center;margin:18px 0">참가자 시점 체험판 · 실제 거래가 아닌 가상 거래입니다</p></main></div>`}
function rules(){const instructions=[['00','현장 뉴스 브리핑','라운드 시작 전 앞쪽 대형 화면에서 AI 뉴스 브리핑을 시청하세요.'],['01','뉴스 확인','기사와 사진을 보고 직접 투자 방향을 판단하세요.'],['02','주식 거래','초기 현금 100만 원으로 8개 기업을 1주씩 사고팔 수 있습니다.'],['03','마감 후 추첨','마감 후 뉴스 결과를 무작위로 결정합니다.'],['04','주가 발표','뉴스 결말과 8개 기업의 실제 등락률을 함께 확인합니다.'],['05','최종 순위','4라운드 후 남은 현금 + 주식 평가액의 수익률로 경쟁합니다.']];return page(`${brand('대기실 ①')}<h1 class="title">${esc(state.name)}님,<br>대회 규칙을 확인해요</h1><p class="sub">경험이 없어도 뉴스를 읽고 직접 매매할 수 있어요.</p><div class="gap24"></div><div class="grid2"><div class="softcard"><div class="label">초기 투자금</div><div class="big blue">100만원</div></div><div class="softcard"><div class="label">진행 라운드</div><div class="big">4라운드</div></div></div><h2 class="section">대회 진행 방식</h2><div class="card">${instructions.map(a=>`<div class="flex" style="align-items:flex-start;margin:14px 0"><span class="stepdot">${a[0]}</span><div><b>${a[1]}</b><div class="sub">${a[2]}</div></div></div>`).join('')}</div><h2 class="section">주요 규칙</h2><div class="notice">• 기업별 주가 변동률은 <b>매 라운드 -30% ~ +30%</b>입니다.<br>• 같은 산업의 두 기업은 같은 방향으로 움직이지만 변동폭은 다릅니다.<br>• 현금을 모두 투자할 필요는 없어요.<br>• 거래 중에는 어떤 산업이 오를지 알려주지 않습니다.</div>`,footer('다음 · 8개 종목 소개　›','next-stocks'))}
function stocks(){return page(`${brand('대기실 ②')}<h1 class="title">투자 가능한<br>8개 가상기업</h1><p class="sub">4개 산업군, 각 2개 기업입니다. 첫 라운드의 시작 주가를 확인하세요.</p>${SECTORS.map(sec=>`<h2 class="section">${sec}</h2><div class="card">${STOCKS.filter(s=>s.sector===sec).map(s=>`<div class="stockrow"><div class="flex"><span class="stockicon">${s.icon}</span><div><div class="stockname">${s.name}</div><div class="sector">${s.description}</div></div></div><div class="price num">${won(s.price)}</div></div>`).join('')}</div>`).join('')}`,footer('대기실로 이동하기　›','next-lobby'))}
function lobby(){return page(`${brand('대기실')}<h1 class="title">대회 시작을<br>기다리고 있어요</h1><p class="sub">${esc(state.name)}님, 참가 등록이 완료됐습니다.</p><div class="gap24"></div><div class="softcard between"><div><div class="label">내 모의투자 자금</div><div class="big blue">1,000,000원</div></div><div style="font-size:37px">💳</div></div><h2 class="section">대회 안내</h2><div class="card"><div class="between"><b>투자 기업</b><span>총 8개</span></div><div class="line"></div><div class="between"><b>투자 라운드</b><span>총 4라운드</span></div><div class="line"></div><div class="between"><b>순위 기준</b><span>최종 수익률</span></div></div><div class="gap24"></div><div class="notice">실제 대회에서는 운영진이 브리핑을 시작하고, 이후 거래 화면을 열어 줍니다. 지금은 <b>참가자 전용 시연</b>이므로 직접 다음 단계로 이동할 수 있어요.</div>`,footer('시연 · 1라운드 브리핑 안내　›','demo-next'))}
function accountCard(){let a=account();return `<div class="softcard"><div class="between"><div><div class="label">${esc(state.name)}님의 총자산</div><div class="big num">${won(a.total)}</div></div><div style="text-align:right"><div class="label">전체 수익률</div><b class="${a.rate>=0?'up':'down'}">${pct(a.rate)}</b></div></div><div class="line"></div><div class="between"><span class="sub">거래 가능 현금</span><b>${won(state.cash)}</b></div></div>`}
function newsBlock(){const n=NEWS[state.round-1];return `<h2 class="section">라운드 ${state.round} · 경제 뉴스</h2><div class="card"><img class="news-image" src="${n.img}" alt="${esc(n.title)}"><div class="pill" style="display:inline-block">가상 뉴스 · 결말 미공개</div><h2 class="news-title">${esc(n.title)}</h2><p class="news-body">${esc(n.intro)}</p><div class="line"></div><b>${state.round===3?'투자 대상 선정 방식':'발표 가능한 결과'}</b>${n.options.map((opt,i)=>`<div class="choice" style="cursor:default">${state.round===3?'':`<b style="color:#1769f4">${String.fromCharCode(65+i)}</b> · `}${esc(opt)}</div>`).join('')}<div class="notice" style="margin-top:12px">실제 결과와 주가 변동은 <b>거래 마감 후</b> 공개됩니다.</div></div>`}
function briefing(){
 const r=state.round;
 return page(`${brand(`ROUND ${r} · 뉴스 브리핑`)}
 <div class="briefing-screen">
   <div class="briefing-illustration"><div class="announce-emoji" aria-hidden="true">📢</div><span class="briefing-kicker">중요 안내</span></div>
   <h1 class="briefing-title">뉴스 브리핑이<br>도착했습니다.</h1>
   <p class="briefing-lead">모두 고개를 들어<br><strong>앞의 큰 화면을 봐주세요.</strong></p>
   <div class="screen-illustration" aria-hidden="true"><div class="display-frame"><div class="display-label">ECONIGHT NEWS</div><div class="display-bars"><i></i><i></i><i></i></div><div class="display-live">● LIVE BRIEFING</div></div><div class="audience-shapes"><span></span><span></span><span></span><span></span><span></span></div></div>
   <div class="notice briefing-notice"><b>AI 뉴스 영상은 행사장 대형 스크린에서만 재생됩니다.</b><br>이 앱에서는 뉴스 영상이 나오지 않습니다.</div>
   <div class="briefing-state"><span class="live-dot"></span> 현장 뉴스 브리핑 대기 중</div>
 </div>`,footer('시연 · 브리핑 종료 후 거래 시작　›','demo-trade',false,'<p class="bottom-note">실제 대회에서는 운영진이 거래를 시작하면 화면이 전환됩니다.</p>'));
}
function marketRows(){
 const shown=STOCKS.map((s,i)=>company(i)).filter(s=>sectorFilter==='전체'||s.sector===sectorFilter);
 return `<h2 class="section">8개 기업 · 한 화면에서 주문</h2>
 <p class="sub trade-help">종목마다 <b>− / +</b>로 수량을 정한 뒤 <b>매수(사기)</b> 또는 <b>매도(팔기)</b>를 누르세요. 추가 주문창은 없습니다.</p>
 <div class="marketnav">${['전체',...SECTORS].map(x=>`<button data-action="sector" data-value="${x}" class="${sectorFilter===x?'active':''}">${x}</button>`).join('')}</div>
 <div class="trade-list">${shown.map(s=>{
   const q=orderQuantities[s.index];
   const maxBuy=Math.floor(state.cash/s.current),maxSell=s.held;
   const max=Math.max(maxBuy,maxSell,1);
   const canBuy=q<=maxBuy,canSell=q<=maxSell;
   return `<article class="trade-card" aria-label="${esc(s.name)} 주문">
      <div class="trade-company"><div class="flex minzero"><div class="stockicon">${s.icon}</div><div class="minzero"><div class="stockname">${esc(s.name)}</div><div class="sector">${esc(s.sector)} · 보유 ${s.held}주</div></div></div><div class="trade-price"><b>${won(s.current)}</b><small>${state.round===1?'첫 라운드 시작가':'현재 거래 가격'}</small></div></div>
      <div class="trade-line"></div>
      <div class="trade-actions"><div class="inline-qty"><button type="button" aria-label="${esc(s.name)} 주문 수량 1주 줄이기" data-action="quantity-minus" data-value="${s.index}" ${q<=1?'disabled':''}>−</button><span aria-live="polite">${q}<small>주</small></span><button type="button" aria-label="${esc(s.name)} 주문 수량 1주 늘리기" data-action="quantity-plus" data-value="${s.index}" ${q>=max?'disabled':''}>+</button></div><button type="button" class="trade-buy" data-action="inline-buy" data-value="${s.index}" ${!canBuy?'disabled':''}>매수</button><button type="button" class="trade-sell" data-action="inline-sell" data-value="${s.index}" ${!canSell?'disabled':''}>매도</button></div>
      <div class="trade-total"><span>${q}주 = <b>${won(s.current*q)}</b></span><span>${!canBuy&&!canSell?'현금·보유 주식 부족':!canBuy?'매수 가능 수량 초과':!canSell?'매도 가능 수량 없음':'바로 거래 가능'}</span></div>
    </article>`;
 }).join('')}</div>`;
}
function market(){return page(`${brand(`ROUND ${state.round} · 거래 중`)}<h1 class="title">뉴스를 읽고<br>직접 투자해 보세요</h1>${accountCard()}${newsBlock()}${marketRows()}<div class="gap16"></div><button class="btn secondary" data-action="portfolio">내 보유 주식 · 주문내역 보기</button><p class="muted-mini" style="text-align:center;margin-top:18px">※ 이번 버전은 참가자 시연판입니다. 실제 대회 결과는 관리자 마감 후 서버에서 추첨해야 합니다.</p>`,footer('시연 · 주문 마감 후 결과 발표　›','demo-reveal','', '<p class="bottom-note">실제 대회에서는 운영진이 주문을 마감합니다.</p>'))}

async function inlineOrder(index, type) {
  if (submitting || state.page !== 'market') return;

  const quantity = orderQuantities[index];
  const side = type === 'buy' ? 'BUY' : 'SELL';

  if (!Number.isInteger(quantity) || quantity < 1) {
    return toast('주문 수량을 확인해주세요.');
  }

  submitting = true;

  // 각 주문을 구별하는 고유 ID
  const requestId = crypto.randomUUID();

  try {
    // Supabase 서버에서 주문 검증 및 체결
    const result = await window.ECONIGHT_LIVE.placeOrder(
      index,
      side,
      quantity,
      requestId
    );

    // 체결 후 서버에 저장된 실제 자산 불러오기
    
     const account = await window.ECONIGHT_LIVE.getAccount();
     const game = await window.ECONIGHT_LIVE.getGame();


    state.cash = account.cash;
    state.prices = account.prices;
    state.changes = account.changes;
    state.round = account.round_no;
    state.phase = account.phase;
    state.publishedResult = game.published_result;

    // 서버의 보유 주식 수량 적용
    state.holdings = {};

    for (const holding of account.holdings) {
      const stock = STOCKS[holding.stock_index];

      if (stock) {
        state.holdings[stock.code] = holding.quantity;
      }
    }

    // 서버의 실제 거래 내역 적용
    state.orders = account.trades.map(trade => ({
      type: trade.side === 'BUY' ? 'buy' : 'sell',
      name: STOCKS[trade.stock_index].name,
      round: trade.round_no,
      price: trade.price,
      qty: trade.quantity
    })).reverse();

    orderQuantities[index] = 1;

    persist();

    toast(
      `${STOCKS[index].name} ${quantity}주 ` +
      `${side === 'BUY' ? '매수' : '매도'} 완료!`
    );

  } catch (error) {
    toast('거래 실패: ' + error.message);

  } finally {
    submitting = false;
    render();
  }
}

function portfolio(){const a=account();return page(`${brand('내 투자 현황')}<h1 class="title">내 포트폴리오</h1>${accountCard()}<h2 class="section">보유 주식</h2><div class="card">${STOCKS.map((s,i)=>company(i)).filter(s=>s.held).map(s=>`<div class="stockrow"><b>${s.name}</b><div style="text-align:right">${s.held}주<div class="sector">${won(s.held*s.current)}</div></div></div>`).join('')||'<div class="empty">아직 보유한 주식이 없어요.</div>'}</div><h2 class="section">주문 내역</h2><div class="card">${state.orders.slice().reverse().map(o=>`<div class="stockrow"><div><b>${o.type==='buy'?'매수':'매도'} · ${esc(o.name)}</b><div class="sector">${o.round}라운드 · ${o.qty}주</div></div><b>${won(o.price*o.qty)}</b></div>`).join('')||'<div class="empty">아직 주문 내역이 없어요.</div>'}</div>`,footer('시장으로 돌아가기　›','back-market'))}
const randomInt=n=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]%n};
// 시연용 결과 추첨. 실제 대회에서는 반드시 서버에서 주문 잠금 후 실행.
function drawInvestedSectors(){
 const count=2+randomInt(2); // 2개 또는 3개 산업 선정
 const pool=[0,1,2,3];
 for(let i=pool.length-1;i>0;i--){const j=randomInt(i+1);[pool[i],pool[j]]=[pool[j],pool[i]]}
 return pool.slice(0,count).sort((a,b)=>a-b);
}
function direction(round,outcome,sector){
 if(round===1)return (sector===0?1:-1)*(outcome===0?1:-1);
 if(round===2)return [1,-1,1,-1][sector]*(outcome===0?1:-1);
 if(round===3)return outcome.includes(sector)?1:-1;
 return [1,-1,1,-1][sector]*(outcome===0?1:-1);
}
function sectorReason(round,outcome,sector){
 const up=direction(round,outcome,sector)>0;
 if(round===1){
   if(sector===0)return up?'AI 데이터센터 증설에 따른 반도체 주문 확대 기대':'데이터센터 증설이 늦어져 AI 반도체 주문 기대 감소';
   return up?'산업 공장에 전력이 우선 공급돼 생산 차질과 비용 부담 완화':'데이터센터 우선 공급으로 공장 전력 비용·생산 차질 우려 확대';
 }
 if(round===2){
   const reasonsA=[
     '제조업 투자 지원과 기업 규제 완화에 따른 설비 투자 기대',
     '제조업 중심 정책으로 소비·패션 지원의 상대적 우선순위 하락',
     '제조업 투자 지원과 규제 완화로 자동차 생산·투자 여건 개선',
     '제조업 위주 정책으로 의료·바이오 지원 기대가 상대적으로 약화'
   ];
   const reasonsB=[
     '친환경·의료 중심 정책으로 반도체 제조 투자 기대가 상대적으로 축소',
     '친환경 소비 지원으로 관련 의류·패션 수요 확대 기대',
     '제조업 직접 지원 축소로 자동차 투자 기대 약화',
     '의료·복지 지원 확대로 의약품과 바이오 서비스 수요 기대 증가'
   ];
   return (outcome===0?reasonsA:reasonsB)[sector];
 }
 if(round===3)return up
   ?'외국인 투자금이 이 산업에 집중돼 주식 매수 수요 증가'
   :'외국인 투자기관이 기존 보유 비중을 줄여 매도 압력 확대';
 const reasonsWeak=[
   '수출 대금을 원화로 환산한 매출·이익 기대 증가',
   '해외에서 들여오는 의류·원단 등의 수입 비용 증가',
   '자동차 수출의 원화 환산 매출 및 가격 경쟁력 개선 기대',
   '해외 원료·장비 수입 비용이 늘어나 수익성 부담 확대'
 ];
 const reasonsStrong=[
   '수출 대금의 원화 환산 금액 감소로 수익 기대 약화',
   '해외 원단·완제품 구매 비용 감소 기대',
   '자동차 수출의 원화 환산 매출 및 가격 경쟁력 약화 우려',
   '해외 의약품 원료·장비 수입 비용 감소 기대'
 ];
 return (outcome===0?reasonsWeak:reasonsStrong)[sector];
}
function outcomeTitle(round,outcome){
 if(round===3){
   const selected=outcome.map(i=>SECTORS[i]).join(' · ');
   return `외국인 투자금 100조 원, ${selected}에 분산 집중`;
 }
 return NEWS[round-1].results[outcome];
}
function revealDemo(){
 if(state.phase!=='TRADING')return;
 const outcome=state.round===3?drawInvestedSectors():randomInt(2),used={},changes=[];
 state.prices=state.prices.map((old,i)=>{
   const sector=SECTORS.indexOf(STOCKS[i].sector),dir=direction(state.round,outcome,sector);
   // 방향을 동일하게 유지하면서 기업별 다른 비율 적용.
   // 0%도 가능하지만 중립은 동일 산업의 두 기업에 함께 적용.
   if(used[sector]===undefined){
     used[sector]={flat:randomInt(301)===0,first:1+randomInt(300)};
   }
   const spec=used[sector];
   let tenth;
   if(spec.flat)tenth=0;
   else if(i%2===0)tenth=spec.first;
   else {do{tenth=1+randomInt(300)}while(tenth===spec.first)}
   const intended=dir*tenth/10;
   let price=Math.round(old*(1+intended/100));
   price=Math.min(Math.floor(old*1.3),Math.max(Math.ceil(old*.7),price));
   price=Math.max(1,price);
   changes.push((price-old)/old*100);
   return price;
 });
 state.changes=changes;state.outcome=outcome;
 state.results.push({round:state.round,outcome,changes:changes.slice(),prices:state.prices.slice()});
 state.phase='REVEALED';move('result');
}
function result(){
 const n=NEWS[state.round-1],idx=state.outcome;
 const resultTag=state.round===3?'투자 산업 발표':`결과 ${String.fromCharCode(65+idx)}`;
 return page(`${brand(`ROUND ${state.round} · 결과 발표`)}
 <h1 class="title">${state.round}라운드<br>결과가 나왔어요</h1>${accountCard()}
 <h2 class="section">뉴스 결말</h2>
 <div class="card"><img src="${n.img}" alt="${esc(n.title)}" class="news-image">
 <span class="pill">${resultTag}</span><h2 class="news-title">${esc(outcomeTitle(state.round,idx))}</h2>
 <p class="news-body">${state.round===3?'4개 산업 중 여러 산업에 자금이 배분됐습니다. 선택되지 않은 산업은 기존 보유 비중을 줄였다는 가상 설정입니다.':'가상의 뉴스 결과가 주문 마감 후 무작위로 결정됐습니다.'}</p></div>
 <h2 class="section">8개 기업 주가 변동</h2>
 <div class="card">${STOCKS.map((s,i)=>`<div class="stockrow"><div><b>${s.name}</b><div class="sector">${s.sector} · ${won(state.prices[i])}</div></div><b class="${state.changes[i]>0?'up':state.changes[i]<0?'down':''}">${pct(state.changes[i])}</b></div>`).join('')}</div>
 <h2 class="section">산업별 상승·하락 이유</h2>
 <div class="card">${SECTORS.map((sec,i)=>{
   const ch=state.changes[i*2];
   const sign=ch>0?'▲ 상승':ch<0?'▼ 하락':'― 보합';
   return `<div class="reasonrow"><div class="between"><b>${esc(sec)}</b><span class="${ch>0?'up':ch<0?'down':''}">${sign}</span></div><p class="reason-text">${esc(sectorReason(state.round,idx,i))}</p></div>`;
 }).join('')}</div>
 <p class="muted-mini" style="margin:16px 0">산업별 이유는 게임용 가상 시나리오 설명이며 실제 주가에 대한 예측은 아닙니다. 변동률은 각 기업의 직전 라운드 가격 대비 −30%~+30%입니다.</p>`,
 footer(state.round===4?'시연 · 최종 순위 발표　›':`시연 · ${state.round+1}라운드 진행　›`,state.round===4?'demo-final':'demo-next'));
}
function nextRound(){if(state.phase==='WAITING'){state.round=1;state.phase='BRIEFING';state.changes=STOCKS.map(()=>0);move('briefing')}else if(state.phase==='REVEALED'&&state.round<4){state.round++;state.phase='BRIEFING';state.changes=STOCKS.map(()=>0);orderQuantities=Array(8).fill(1);move('briefing')}}
function fakeRankings(){const a=account();const names=['김현근','유혜원','박지훈','이서연','정민수','최지현','한지민','오준서','강하늘','김태윤','유민서','송지호','배준호','문지안','오예린'];const names49=[...names,...Array.from({length:34},(_,i)=>`시연참가자${i+16}`)];let out=names49.map((name,i)=>{const rate=30-i*0.95;return{name,rate,assets:Math.round(INITIAL_CASH*(1+rate/100)),mine:false}});out.push({name:state.name,rate:a.rate,assets:a.total,mine:true});out.sort((x,y)=>y.assets-x.assets||x.name.localeCompare(y.name,'ko'));return out.map((x,i)=>({...x,rank:i+1}))}
function podium(){const [a,b,c]=state.rankings;return `<div class="podium">${[b,a,c].map((r,i)=>`<div class="pod ${['second','first','third'][i]}"><span class="medal">${['🥈','👑','🥉'][i]}</span><b>${r.rank}위</b><div class="person">${esc(r.name)}</div><div class="pct">${pct(r.rate)}</div></div>`).join('')}</div>`}
function finalPage(){let me=state.rankings.find(r=>r.mine),msg=msgRanges.find(m=>me.rank>=m.min&&me.rank<=m.max)||msgRanges.at(-1);return page(`${brand('FINAL · 시연')}<div class="banner"><h2>${esc(msg.title)}</h2><p class="sub">${esc(msg.sub)}</p></div><h2 class="section">TOP 3 시상식 단상</h2>${podium()}<div class="softcard"><div class="between"><div><div class="label">나의 최종 순위</div><div class="big blue">${me.rank}위 <span class="sub">/ 50명</span></div></div><div style="text-align:right"><div class="label">최종 수익률</div><div class="big ${me.rate>=0?'up':'down'}" style="font-size:25px">${pct(me.rate)}</div><div class="label">총자산 ${won(me.assets)}</div></div></div></div><h2 class="section">전체 순위 (50명)</h2><div class="card" style="padding:8px 10px"><div class="rankrow ranking-head"><span>순위</span><span>이름</span><span>수익률</span><span>최종 자산</span></div>${state.rankings.map(r=>`<div class="rankrow ${r.mine?'mine':''}"><span class="n">${r.rank}</span><span class="who">${esc(r.name)}${r.mine?' (나)':''}</span><span class="${r.rate>=0?'up':'down'}">${pct(r.rate)}</span><span>${won(r.assets)}</span></div>`).join('')}</div><div class="notice" style="margin-top:20px">⚠ 전체 순위의 다른 참가자들은 <b>시연용 가상 데이터</b>입니다. 실제 대회 순위가 아닙니다.</div>`,footer('처음부터 다시 체험하기　↻','reset'))}

function lockedPage() {
  return page(`
    ${brand(`ROUND ${state.round} · 거래 마감`)}

    <div style="text-align:center;padding:65px 10px;">
      <div style="font-size:65px;">🔒</div>

      <h1 class="title">거래가 마감되었습니다</h1>

      <p class="sub">
        모든 참가자의 주식 거래가 종료되었습니다.
        <br>
        뉴스 결과를 공개할 예정입니다.
      </p>

      <div class="notice" style="margin-top:30px;">
        운영진의 결과 발표를 기다려 주세요.
        <br>
        결과는 자동으로 화면에 표시됩니다.
      </div>
    </div>

    ${accountCard()}
  `);
}


function render() {
  const screens = {
    welcome: intro,
    rules,
    stocks,
    lobby,
    briefing,
    market,
    portfolio,
    locked: lockedPage,
    result,
    final: finalPage
  };

  const html = (screens[state.page] || intro)();

  $('app').innerHTML = html;
}

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;
 e.preventDefault();const action=el.dataset.action,v=el.dataset.value;
 if(action==='next-stocks')return move('stocks');
 if(action==='next-lobby')return move('lobby');
 if(action==='demo-next')return nextRound();
 if(action==='demo-trade'){
   if(state.phase!=='BRIEFING')return;
   state.phase='TRADING';orderQuantities=Array(8).fill(1);return move('market');
 }
 if(action==='demo-reveal')return revealDemo();
 if(action==='demo-final'){
   if(state.round!==4||state.phase!=='REVEALED')return;
   state.rankings=fakeRankings();state.phase='FINAL';return move('final');
 }
 if(action==='sector'){sectorFilter=v;return render()}
 if(action==='quantity-minus'||action==='quantity-plus'){
   const index=Number(v),s=company(index),cap=Math.max(Math.floor(state.cash/s.current),s.held,1);
   orderQuantities[index]=Math.max(1,Math.min(cap,orderQuantities[index]+(action==='quantity-plus'?1:-1)));
   return render();
 }
 if(action==='inline-buy'||action==='inline-sell')return inlineOrder(Number(v),action==='inline-buy'?'buy':'sell');
 if(action==='portfolio')return move('portfolio');
 if(action==='back-market')return move('market');
 if(action==='reset'){
   if(!confirm('시연 데이터를 지우고 처음부터 시작할까요?'))return;
   state=stateDefaults();orderQuantities=Array(8).fill(1);persist();return move('welcome');
 }
});

document.addEventListener('submit', async (e) => {
  if (e.target.id !== 'name-form') return;

  e.preventDefault();

  const name = $('username').value.trim();

  if (name.length < 1 || name.length > 20) {
    return toast('이름은 1~20자로 입력해 주세요.');
  }

  if (submitting) return;

  submitting = true;

  const button = e.target.querySelector(
    'button[type="submit"]'
  );

  button.disabled = true;
  button.textContent = '참가 등록 중...';

  try {
    // Supabase 서버에 참가자 등록 요청
    const result = await window.ECONIGHT_LIVE.register(name);

    // 서버에서 승인한 이름과 초기 자금 사용
    state.name = result.name;
    state.cash = result.cash;

    // 예전 시연용 투자 기록 초기화
    state.holdings = {};
    state.orders = [];

    persist();

    toast('참가 등록이 완료되었습니다!');

    move('rules');

  } catch (error) {
    toast('등록 실패: ' + error.message);

    button.disabled = false;
    button.textContent = '시작하기　›';

  } finally {
    submitting = false;
  }
});

render();
// 서버 상태를 불러오는 중인지 확인
let liveSyncBusy = false;


async function syncWithServer() {
  if (liveSyncBusy || submitting || !state.name) return;

  liveSyncBusy = true;

  try {
    const account = await window.ECONIGHT_LIVE.getAccount();

    const previousPhase = state.phase;
    const previousRound = state.round;

    state.name = account.name;
    state.cash = account.cash;
    state.prices = account.prices;
    state.changes = account.changes;
    state.round = account.round_no;
    state.phase = account.phase;

    state.holdings = {};

    for (const item of account.holdings) {
      const stock = STOCKS[item.stock_index];

      if (stock) {
        state.holdings[stock.code] = item.quantity;
      }
    }

    state.orders = account.trades.map(t => ({
      type: t.side === 'BUY' ? 'buy' : 'sell',
      name: STOCKS[t.stock_index].name,
      round: t.round_no,
      price: t.price,
      qty: t.quantity
    })).reverse();

    if (
      previousPhase !== state.phase ||
      previousRound !== state.round
    ) {
      if (state.phase === 'BRIEFING') {
        state.page = 'briefing';
      } else if (state.phase === 'TRADING') {
        state.page = 'market';
        orderQuantities = Array(8).fill(1);
      } else if (state.phase === 'LOBBY') {
        state.page = 'lobby';
      } else if (state.phase === 'LOCKED') {
        state.page = 'locked';
      }
    }

    persist();

    if (
      ['lobby', 'briefing', 'market', 'portfolio', 'locked']
        .includes(state.page)
    ) {
      render();
    }

  } catch (error) {
    console.warn('서버 동기화 실패:', error.message);
  } finally {
    liveSyncBusy = false;
  }
}

// 페이지 접속 시 동기화
syncWithServer();

// 5초마다 서버 상태 확인
setInterval(syncWithServer, 5000);
