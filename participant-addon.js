
/* ECONIGHT INVEST
 * 참가자 전 화면 공지 · 타이머 · 긴급 거래 중단
 */
(() => {
  'use strict';

  const live = window.ECONIGHT_LIVE;
  if (!live?.db) return;

  const db = live.db;

  // 모든 화면 위에 표시할 공지와 타이머
  const outer = document.createElement('div');
  outer.id = 'ei-ops-display';
  outer.setAttribute('aria-live', 'polite');

  outer.style.cssText = `
    position:fixed;
    inset:0 0 auto;
    z-index:10005;
    pointer-events:none;
    font-family:system-ui,sans-serif;
  `;

  const alert = document.createElement('div');

  alert.style.cssText = `
    display:none;
    background:#173665;
    color:#fff;
    text-align:center;
    padding:13px 20px;
    box-shadow:0 4px 18px #0002;
    font-size:15px;
    font-weight:700;
    white-space:pre-wrap;
    overflow-wrap:anywhere;
  `;

  const timer = document.createElement('div');

  timer.style.cssText = `
    display:none;
    margin:8px 12px 0 auto;
    width:max-content;
    max-width:calc(100% - 24px);
    border-radius:15px;
    background:#fff;
    color:#142b4a;
    box-shadow:0 4px 22px #0003;
    padding:12px 16px;
    font-size:15px;
    font-weight:700;
  `;

  outer.append(alert, timer);

  // 긴급 거래 중단 시 전체 화면 안내
  const paused = document.createElement('div');

  paused.id = 'ei-paused-cover';

  paused.style.cssText = `
    display:none;
    position:fixed;
    inset:0;
    z-index:10004;
    background:rgba(7,18,39,.94);
    color:white;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:30px;
    font:600 22px system-ui;
  `;

  paused.innerHTML = `
    <div>
      <div style="font-size:60px;margin-bottom:18px">
        ⏸
      </div>

      긴급 거래 중단

      <p style="
        font-size:15px;
        opacity:.85;
        font-weight:400;
        line-height:1.7;
      ">
        운영진이 거래를 잠시 중단했습니다.
        <br>
        현금과 보유 주식은 그대로 유지됩니다.
        <br>
        운영진의 재개 안내를 확인해 주세요.
      </p>
    </div>
  `;

  document.body.append(outer, paused);

  let ops = null;
  let checking = false;

  function paint() {
    if (!ops) return;

    // 운영진 전체 공지
    const announcement =
      String(ops.announcement || '').trim();

    alert.textContent = announcement
      ? '📢 운영진 공지\n' + announcement
      : '';

    alert.style.display = announcement
      ? 'block'
      : 'none';

    // 참가자 거래 타이머
    const trading =
      ops.phase === 'TRADING' ||
      ops.phase === 'PAUSED';

    const end = ops.round_end_at
      ? new Date(ops.round_end_at).getTime()
      : NaN;

    const showTimer =
      trading && Number.isFinite(end);

    timer.style.display = showTimer
      ? 'block'
      : 'none';

    if (showTimer) {
      const remain = Math.max(
        0,
        Math.ceil((end - Date.now()) / 1000)
      );

      const mm = String(
        Math.floor(remain / 60)
      ).padStart(2, '0');

      const ss = String(
        remain % 60
      ).padStart(2, '0');

      timer.textContent =
        '⏱ 거래 남은 시간  ' +
        mm + ':' + ss +
        (remain === 0
          ? ' · 관리자 마감 대기'
          : '');

      timer.style.color =
        remain <= 30 ? '#b91c1c' : '#142b4a';
    }

    // 긴급 중단 오버레이
    paused.style.display =
      ops.phase === 'PAUSED'
        ? 'flex'
        : 'none';
  }

  // 서버에서 운영 상태 확인
  async function poll() {
    if (
      checking ||
      document.visibilityState === 'hidden'
    ) return;

    checking = true;

    try {
      const { data, error } =
        await db.rpc('ei_public_ops');

      if (error) throw error;

      if (data) {
        ops = data;
        paint();
      }
    } catch (error) {
      console.warn(
        '운영 상태 조회 실패:',
        error.message
      );
    } finally {
      checking = false;
    }
  }

  // 참가자 접속 상태 기록
  async function heartbeat() {
    try {
      const session = await live.getSession();

      if (session?.user?.is_anonymous) {
        const { error } = await db.rpc(
          'ei_participant_heartbeat'
        );

        if (error) {
          console.warn(
            '접속 기록 실패:',
            error.message
          );
        }
      }
    } catch (error) {
      console.warn(
        '접속 신호 실패:',
        error.message
      );
    }
  }

  poll();
  heartbeat();

  // 서버 공지 및 중단 상태: 2초마다 확인
  setInterval(poll, 2000);

  // 타이머는 화면에서 부드럽게 갱신
  setInterval(paint, 250);

  // 접속 상태 기록: 15초마다
  setInterval(heartbeat, 15000);

  // 다른 앱에서 돌아오면 바로 확인
  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) {
        poll();
        heartbeat();
      }
    }
  );

  window.addEventListener('focus', poll);
})();
