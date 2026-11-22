/* ECONIGHT INVEST 관리자 운영 확장 — admin.html의 기존 client/verifyAdmin 유지 */
(() => {
  'use strict';
  const css=document.createElement('link');css.rel='stylesheet';css.href='admin-suite.css';document.head.appendChild(css);
  const area=document.getElementById('adminBox');
  if(!area)return;
  const extension=document.createElement('div');
  extension.innerHTML=`
    <div class="card" id="ei-operations">
      <div class="ei-flex" style="justify-content:space-between"><div><h2 style="margin-bottom:4px">대회 운영 센터</h2><p class="ei-note" id="ei-substatus">관리자 데이터 동기화 중...</p></div><button class="ei-mini secondary" id="ei-reload">새로고침</button></div>
      <div class="ei-grid" id="ei-kpis"></div>
      <div class="ei-tabs" style="margin-top:20px">
        <button data-ei-tab="overview" class="active">종합 현황</button>
        <button data-ei-tab="participants">참가자</button>
        <button data-ei-tab="trades">거래 감시</button>
        <button data-ei-tab="ranking">순위</button>
        <button data-ei-tab="logs">관리 기록</button>
        <button data-ei-tab="check">사전 점검</button>
      </div>
      <div data-ei-panel="overview" class="ei-panel active">
        <div class="ei-stack">
          <div><h3>긴급 운영 제어</h3><p class="ei-note">주문 서버가 거래 중단 상태를 직접 검사합니다.</p><button id="ei-pauser" class="danger">Ⅱ 긴급 거래 중단</button><p class="ei-note">현재 접속: <b id="ei-online">—</b></p></div>
          <div><h3>라운드 타이머</h3><div class="ei-clock" id="ei-clock">--:--</div><div class="ei-flex"><select id="ei-timer" class="ei-input" style="flex:1;min-width:150px"><option value="180">3분</option><option value="300">5분</option><option value="600">10분</option><option value="60">1분</option><option value="0">타이머 해제</option></select><button class="ei-mini" id="ei-timer-set">설정</button></div><p id="ei-clock-note" class="ei-note"></p></div>
        </div>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0">
        <div class="ei-stack">
          <div><h3>전체 참가자 공지</h3><p class="ei-note">현재 공지: <span id="ei-notice-current">없음</span></p><textarea id="ei-notice" rows="3" maxlength="180" placeholder="예: 1분 뒤 거래를 마감합니다."></textarea><div class="ei-flex"><button id="ei-send-notice" class="ei-mini">공지 보내기</button><button id="ei-clear-notice" class="ei-mini secondary">공지 지우기</button></div></div>
        </div>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0">
        <div class="ei-flex"><button id="ei-export" class="ei-mini secondary">최종 순위·거래·보유종목 CSV 내려받기</button><button id="ei-reset-ops" class="ei-mini secondary">운영 설정만 초기화</button></div>
      </div>
      <div data-ei-panel="participants" class="ei-panel"><h3>참가자 현황</h3><p class="ei-note">45초 이내 접속 신호가 오면 접속 중으로 표시합니다.</p><input class="ei-input" id="ei-search" placeholder="참가자 이름 검색"><div id="ei-participants"></div>
        <div id="ei-detail-card" hidden style="margin-top:20px"><h3>참가자 상세: <span id="ei-detail-name"></span></h3><div class="ei-detail" id="ei-detail"></div><input type="hidden" id="ei-current-user"><div class="ei-flex" style="margin-top:12px"><input class="ei-input" id="ei-name-change" placeholder="변경할 닉네임" style="flex:1;min-width:150px"><button id="ei-rename" class="ei-mini">이름 변경</button><button id="ei-block" class="ei-mini secondary">거래 제한</button><button id="ei-remove" class="ei-mini danger">참가자 제거</button></div><p class="ei-note">이름 변경·제거는 거래 기록이 없는 대기실에서만 가능하며, 거래 제한은 진행 중에도 적용됩니다.</p></div>
      </div>
      <div data-ei-panel="trades" class="ei-panel"><h3>실시간 거래 모니터링</h3><p class="ei-note" id="ei-trade-total"></p><select id="ei-trade-filter" class="ei-input"><option value="ALL">모든 라운드</option><option value="1">1라운드</option><option value="2">2라운드</option><option value="3">3라운드</option><option value="4">4라운드</option></select><div class="ei-grid" id="ei-volumes" style="margin:12px 0"></div><div id="ei-trade-table"></div><p class="ei-note">화면에는 최근 최대 1500건만 표시됩니다. CSV는 전체 거래를 내려받습니다.</p></div>
      <div data-ei-panel="ranking" class="ei-panel"><h3>관리자 전용 현재 순위</h3><p class="ei-note" id="ei-rank-hint"></p><div id="ei-rank-table"></div></div>
      <div data-ei-panel="logs" class="ei-panel"><h3>관리자 조작 이력</h3><div id="ei-log-table"></div></div>
      <div data-ei-panel="check" class="ei-panel"><h3>행사 시작 전 점검</h3><div id="ei-health"></div></div>
    </div>`;
  area.insertBefore(extension,area.firstElementChild);
  const toastBox=document.createElement('div');toastBox.id='ei-toast';toastBox.setAttribute('role','status');document.body.appendChild(toastBox);
  const S=['삼성우전자','SK하이재하','유혜니클로','파타고미나','포르승재','경현대자동차','현근당','삼성바이오새로직스'];
  const $=id=>document.getElementById(id);
  const safe=x=>String(x??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const money=n=>Number(n||0).toLocaleString('ko-KR')+'원';
  const fmt=x=>x?new Date(x).toLocaleString('ko-KR'):'—';
  let snapshot=null, tab='overview', busyOps=false, tabCache={}, lastGameKey='';
  const toast=t=>{const el=$('ei-toast');el.textContent=t;el.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display='none',4000)};
  function showTab(name){
    tab=name;
    document.querySelectorAll('[data-ei-tab]').forEach(b=>b.classList.toggle('active',b.dataset.eiTab===name));
    document.querySelectorAll('[data-ei-panel]').forEach(p=>p.classList.toggle('active',p.dataset.eiPanel===name));
    draw();
  }
  const holdingsOf=id=>(snapshot?.holdings||[]).filter(h=>h.user_id===id);
  const tradesOf=id=>(snapshot?.trades||[]).filter(t=>t.user_id===id);
  const valueOf=p=>{
    let total=Number(p.cash||0);
    const prices=snapshot?.game?.prices||[];
    for(const h of holdingsOf(p.user_id))total+=Number(h.quantity)*Number(prices[h.stock_index]||0);
    return total;
  };
  const rankRows=()=>[...(snapshot?.participants||[])].sort((a,b)=>valueOf(b)-valueOf(a)||String(a.display_name).localeCompare(String(b.display_name)));
  const countOnline=()=>snapshot?.participants?.filter(p=>p.last_seen_at&&(Date.now()-new Date(p.last_seen_at).getTime())<45000).length||0;
  const phaseLabel={LOBBY:'대기실',BRIEFING:'뉴스 브리핑',TRADING:'거래 중',PAUSED:'긴급 중단',LOCKED:'거래 마감',REVEALED:'결과 공개',FINISHED:'종료'};
  function table(headers,rows){return '<div class="ei-table-wrap"><table class="ei-table"><thead><tr>'+headers.map(h=>'<th>'+safe(h)+'</th>').join('')+'</tr></thead><tbody>'+ (rows.length?rows.map(r=>'<tr>'+r.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join(''):'<tr><td colspan="'+headers.length+'">표시할 데이터가 없습니다.</td></tr>')+'</tbody></table></div>'}
  function draw(){
    if(!snapshot)return;
    const {game,ops,participants=[],trades=[],logs=[],blocked=[]}=snapshot;
    const total=Number(snapshot.trade_count||0);
    const online=countOnline();
    const kpis=[['참가자',participants.length+' / 50명'],['최근 접속',online+'명'],['현재 라운드',(game.round_no||0)+' / 4'],['전체 체결',total.toLocaleString()+'건']];
    $('ei-kpis').innerHTML=kpis.map(([k,v])=>'<div class="ei-kpi"><small>'+k+'</small><b>'+safe(v)+'</b></div>').join('');
    $('ei-substatus').textContent=(ops.trading_paused?'긴급 거래 중단':phaseLabel[game.phase]||game.phase)+' · 마지막 동기화 '+new Date().toLocaleTimeString('ko-KR');
    $('ei-online').textContent=online+'명 / '+participants.length+'명';
    $('ei-pauser').disabled=busyOps||!game.phase==='TRADING';
    $('ei-pauser').textContent=ops.trading_paused?'▶ 거래 재개':'Ⅱ 긴급 거래 중단';
    $('ei-timer-set').disabled=busyOps||!game.phase==='TRADING';
    $('ei-notice-current').textContent=ops.announcement||'등록된 공지가 없습니다.';
    if(tab==='participants'){
      const search=$('ei-search').value.trim().toLowerCase();
      const rows=participants.filter(p=>p.display_name.toLowerCase().includes(search)).map(p=>[
        safe(p.display_name)+(blocked.some(b=>b.user_id===p.user_id)?' <span class="ei-bad">(제한)</span>':''),p.last_seen_at&&Date.now()-new Date(p.last_seen_at)<45000?'<span class="ei-good">● 접속</span>':'<span class="ei-pill">미접속</span>',
        money(p.cash),money(valueOf(p)),fmt(p.created_at),
        '<button data-ei-detail="'+safe(p.user_id)+'" class="ei-soft">상세·관리</button>'
      ]);
      $('ei-participants').innerHTML=table(['참가자','접속','현금','평가자산','등록일시','관리'],rows);
    }
    if(tab==='trades'){
      const filter=$('ei-trade-filter').value;
      const trs=trades.filter(t=>filter==='ALL'||String(t.round_no)===filter);
      const byID=Object.fromEntries(participants.map(p=>[p.user_id,p.display_name]));
      $('ei-trade-table').innerHTML=table(['시각/번호','이름','라운드','종목','구분','수량','체결가'],trs.slice(0,500).map(t=>[
        safe(t.created_at?fmt(t.created_at):'#'+t.id),safe(byID[t.user_id]||'탈퇴'),safe(t.round_no),safe(S[t.stock_index]||t.stock_index),
        t.side==='BUY'?'<span class="ei-good">매수</span>':'<span class="ei-bad">매도</span>',safe(t.quantity),money(t.price)]));
      const volume=Array.from({length:8},(_,i)=>({name:S[i],qty:trades.filter(t=>t.stock_index===i).reduce((sum,t)=>sum+Number(t.quantity),0)}));
      $('ei-volumes').innerHTML=volume.map(v=>'<div class="ei-kpi"><small>'+safe(v.name)+'</small><b>'+v.qty.toLocaleString()+'주</b></div>').join('');
      $('ei-trade-total').textContent='총 '+total+'건 · 최근 최대 1500건 조회';
    }
    if(tab==='ranking'){
      const finished=game.phase==='FINISHED';
      const standings=rankRows();
      $('ei-rank-table').innerHTML=table(['순위','참가자','평가 자산','수익률'],standings.map((p,i)=>[
        String(i+1),safe(p.display_name),money(valueOf(p)),((valueOf(p)/1000000-1)*100).toFixed(2)+'%']));
      $('ei-rank-hint').textContent=finished?'최종 순위 계산값입니다. 공개 스크린은 별도 버튼으로 제어합니다.':'관리자 전용 참고 순위이며, 대회 종료 전에 참가자·스크린에 공개되지 않습니다.';
    }
    if(tab==='logs'){
      const rs=logs.map(l=>[safe(l.id??''),safe(l.action||''),safe(l.round_no||0),safe(l.created_at?fmt(l.created_at):''),safe(l.actor||'')]);
      $('ei-log-table').innerHTML=table(['번호','조작','라운드','일시','관리자 ID'],rs);
    }
    if(tab==='check'){
      const issues=[];
      if(game.round_no<0||game.round_no>4)issues.push('라운드 번호가 범위를 벗어납니다.');
      if(!Array.isArray(game.prices)||game.prices.length!==8)issues.push('종목 가격 데이터가 8개가 아닙니다.');
      if(game.prices?.some(v=>!Number.isFinite(Number(v))||v<=0))issues.push('0원 이하의 종목 가격이 발견됐습니다.');
      if(participants.length>50)issues.push('참가 인원이 50명을 초과했습니다.');
      if(ops.trading_paused)issues.push('긴급 거래 중단 상태입니다.');
      if(game.phase==='FINISHED')issues.push('대회가 이미 종료된 상태입니다.');
      $('ei-health').innerHTML=issues.length?issues.map(x=>'<p class="ei-bad">⚠ '+safe(x)+'</p>').join(''):'<p class="ei-good">✓ 서버 응답·가격 8개·참가 인원 기본 검사 정상</p>';
      $('ei-health').innerHTML+='<p class="ei-note">서버 연결 정상 · 현재 '+safe(phaseLabel[game.phase]||game.phase)+' · '+participants.length+'명 등록. 실제 50명 동시 접속을 검증한 것은 아닙니다.</p>';
    }
  }
  function clock(){
    if(!snapshot?.ops)return;
    const date=snapshot.ops.round_end_at;
    const s=date?Math.max(0,Math.ceil((new Date(date).getTime()-Date.now())/1000)):null;
    $('ei-clock').textContent=s===null?'설정 안 됨':String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
    $('ei-clock-note').textContent=s===0?'시간이 끝났습니다. 관리자가 거래 마감 버튼을 눌러야 합니다.':'※ 알림용 타이머 · 자동 마감은 하지 않습니다.';
  }
  async function refresh(){
    if(!client||$('adminBox').classList.contains('hidden')||busyOps)return;
    const {data,error}=await client.rpc('ei_admin_overview');
    if(error)throw error;
    snapshot=data;draw();clock();
    if(data.game.phase!==lastGameKey){lastGameKey=data.game.phase;await loadGame();}
  }
  async function command(action,payload={},promptText=''){
    if(busyOps)return;
    if(promptText&&!confirm(promptText))return;
    busyOps=true;
    try{
      const {data,error}=await client.rpc('ei_ops_command',{p_action:action,p_payload:payload});
      if(error)throw error;
      toast('저장 완료: '+action);
      await refreshAfter();return data;
    }catch(err){toast('처리 실패: '+err.message);throw err;}
    finally{busyOps=false;draw();}
  }
  async function refreshAfter(){const {data,error}=await client.rpc('ei_admin_overview');if(error)throw error;snapshot=data;draw();clock();await loadGame();}
  function showDetail(id){
    const p=snapshot?.participants.find(p=>p.user_id===id);if(!p)return;
    const h=holdingsOf(id).map(h=>S[h.stock_index]+' '+h.quantity+'주').join('\n')||'없음';
    const t=tradesOf(id).map(t=>'R'+t.round_no+' '+S[t.stock_index]+' '+(t.side==='BUY'?'매수':'매도')+' '+t.quantity+'주 @'+money(t.price)).join('\n')||'없음';
    $('ei-detail').textContent='이름: '+p.display_name+'\n현금: '+money(p.cash)+'\n평가자산: '+money(valueOf(p))+'\n접속: '+fmt(p.last_seen_at)+'\n\n보유 주식\n'+h+'\n\n최근 거래 기록\n'+t;
    $('ei-detail-name').textContent=p.display_name;
    $('ei-name-change').value=p.display_name;
    $('ei-current-user').value=id;
    const isBlocked=(snapshot?.blocked||[]).some(b=>b.user_id===id);
    $('ei-block').textContent=isBlocked?'거래 제한 해제':'거래 제한';
    $('ei-detail-card').hidden=false;
    $('ei-detail-card').scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function csvCell(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
  function downloadCSV(name,headers,rows){
    const content='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8;'}));
    const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function exportFiles(){
    const {data,error}=await client.rpc('ei_admin_export');if(error)throw error;
    const ps=data.participants||[],ts=data.trades||[],hs=data.holdings||[],prices=data.game?.prices||[];
    const hBy=Object.fromEntries(ps.map(p=>[p.user_id,p.display_name]));
    const assets=p=>Number(p.cash||0)+hs.filter(h=>h.user_id===p.user_id).reduce((a,h)=>a+Number(h.quantity)*(prices[h.stock_index]||0),0);
    const sorted=[...ps].sort((a,b)=>assets(b)-assets(a)||String(a.user_id).localeCompare(String(b.user_id)));
    downloadCSV('econight_rankings.csv',['순위','닉네임','총자산(원)','수익률(%)','현금(원)','참가자ID'],sorted.map((p,i)=>[i+1,p.display_name,assets(p),((assets(p)/1000000-1)*100).toFixed(4),p.cash,p.user_id]));
    downloadCSV('econight_trades.csv',['거래ID','참가자','라운드','종목','매수매도','수량','가격(원)','거래일시'],ts.map(t=>[t.id,hBy[t.user_id]||'',t.round_no,S[t.stock_index]||t.stock_index,t.side,t.quantity,t.price,t.created_at||'']));
    downloadCSV('econight_holdings.csv',['참가자','종목','수량','현재가격(원)','평가금액(원)'],hs.map(h=>[hBy[h.user_id]||'',S[h.stock_index]||h.stock_index,h.quantity,prices[h.stock_index],h.quantity*prices[h.stock_index]]));
    toast('CSV 3개를 다운로드했습니다.');
  }
  document.querySelectorAll('[data-ei-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.eiTab)));
  $('ei-reload').addEventListener('click',()=>refresh().catch(e=>toast('조회 실패: '+e.message)));
  $('ei-pauser').addEventListener('click',()=>command(snapshot.ops.trading_paused?'resume':'pause',{},snapshot.ops.trading_paused?'거래를 재개할까요?':'긴급 거래 중단을 실행할까요? 서버가 주문을 차단합니다.').catch(()=>{}));
  $('ei-timer-set').addEventListener('click',()=>command('timer',{seconds:Number($('ei-timer').value)}).catch(()=>{}));
  $('ei-send-notice').addEventListener('click',()=>command('announce',{message:$('ei-notice').value}).catch(()=>{}));
  $('ei-clear-notice').addEventListener('click',()=>command('announce',{message:''}).catch(()=>{}));
  $('ei-search').addEventListener('input',()=>draw());
  $('ei-trade-filter').addEventListener('change',()=>draw());
  $('ei-participants').addEventListener('click',e=>{const b=e.target.closest('[data-ei-detail]');if(b)showDetail(b.dataset.eiDetail)});
  $('ei-rename').addEventListener('click',()=>{const id=$('ei-current-user').value;command('rename',{user_id:id,name:$('ei-name-change').value},'이 참가자의 닉네임을 변경할까요?').then(()=>showDetail(id)).catch(()=>{})});
  $('ei-block').addEventListener('click',()=>{const id=$('ei-current-user').value;const blocked=(snapshot?.blocked||[]).some(b=>b.user_id===id);command(blocked?'unblock':'block',{user_id:id},blocked?'이 참가자의 거래 제한을 해제할까요?':'이 참가자의 모든 신규 매매를 서버에서 차단할까요?').then(()=>showDetail(id)).catch(()=>{})});
  $('ei-remove').addEventListener('click',()=>{const id=$('ei-current-user').value;const name=$('ei-detail-name').textContent;if(prompt(name+' 참가자를 삭제하려면 이름을 다시 입력해 주세요.')!==name)return;command('remove',{user_id:id},'최종 확인: 대기실에서 이 참가자를 제거할까요?').then(()=>$('ei-detail-card').hidden=true).catch(()=>{})});
  $('ei-export').addEventListener('click',()=>exportFiles().catch(e=>toast('내보내기 실패: '+e.message)));
  $('ei-reset-ops').addEventListener('click',()=>command('reset_ops',{},'참가자는 유지하고 운영 설정과 접속 기록만 초기화할까요?').catch(()=>{}));
  showTab('overview');
  setInterval(clock,1000);
  setInterval(()=>refresh().catch(e=>console.warn('관리자 데이터 조회 실패',e.message)),5000);
  setTimeout(()=>refresh().catch(()=>{}),1200);
})();
