/* 공지, 서버 거래 중지 표시 및 접속 하트비트. app.js 동작에는 영향을 주지 않습니다. */
(() => {
  const db=window.ECONIGHT_LIVE?.db;
  if(!db)return;
  let lastRevision=-1;
  const banner=document.createElement('div');banner.id='ei-live-announcement';
  banner.style.cssText='display:none;position:fixed;top:0;left:0;right:0;z-index:9998;background:#102a51;color:white;padding:12px 20px;text-align:center;font:600 14px system-ui;box-shadow:0 5px 15px #0002';
  const paused=document.createElement('div');paused.id='ei-paused-cover';
  paused.style.cssText='display:none;position:fixed;inset:0;z-index:9999;background:rgba(7,18,39,.94);color:white;align-items:center;justify-content:center;text-align:center;padding:30px;font:600 22px system-ui';
  paused.innerHTML='<div><div style="font-size:60px;margin-bottom:18px">⏸</div>운영진이 거래를 잠시 중단했습니다.<p style="font-size:15px;opacity:.8;font-weight:400">보유 현금과 주식은 그대로 유지됩니다.<br>거래 재개 안내를 기다려 주세요.</p></div>';
  document.body.append(banner,paused);
  async function tick(){
    try{
      const s=await window.ECONIGHT_LIVE.getSession();
      if(!s?.user?.is_anonymous)return;
      await db.rpc('ei_participant_heartbeat');
      const {data,error}=await db.rpc('ei_public_ops');if(error)throw error;
      banner.textContent=data.announcement?'📢 '+data.announcement:'';
      banner.style.display=data.announcement?'block':'none';
      paused.style.display=data.phase==='PAUSED'?'flex':'none';
      lastRevision=data.announcement_revision;
    }catch(e){console.warn('행사 공지 조회 실패:',e.message)}
  }
  tick();setInterval(tick,15000);
})();
