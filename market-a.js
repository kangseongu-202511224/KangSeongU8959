
/*
 * ECONIGHT INVEST
 * A안 — 8개 기업 통합 주문 화면
 *
 * 기존 app.js의 Supabase 거래 및 동기화 기능 유지
 */

(() => {
  'use strict';

  

  const sheet = document.createElement('style');

  sheet.textContent = `
    .ei-a-screen {
      padding-bottom: 22px;
    }

    .ei-a-heading {
      font-size: 24px;
      font-weight: 850;
      letter-spacing: -.7px;
      margin: 20px 0 4px;
    }

    .ei-a-lead {
      font-size: 13px;
      color: #68778b;
      margin: 0 0 16px;
      line-height: 1.6;
    }

    .ei-a-summary {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
      margin: 12px 0 14px;
    }

    .ei-a-stat {
      border: 1px solid #e4eaf4;
      background: #f6f9fe;
      border-radius: 12px;
      padding: 11px 8px;
      min-width: 0;
    }

    .ei-a-stat small {
      display: block;
      color: #64748b;
      font-size: 10px;
      margin-bottom: 6px;
    }

    .ei-a-stat b {
      display: block;
      white-space: nowrap;
      font-size: clamp(12px, 3vw, 16px);
      letter-spacing: -.5px;
    }

    .ei-a-notice {
      margin: 10px 0 16px;
      padding: 12px 14px;
      background: #eef5ff;
      border-radius: 13px;
      font-size: 13px;
      line-height: 1.6;
      color: #244371;
    }

    .ei-a-section {
      font-size: 18px;
      font-weight: 800;
      margin: 23px 0 10px;
    }

    .ei-a-card {
      background: white;
      border: 1px solid #e6eaf2;
      border-radius: 16px;
      overflow: hidden;
      margin: 9px 0;
      box-shadow: 0 2px 8px rgba(20,40,85,.04);
    }

    .ei-a-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      padding: 12px 12px 9px;
    }

    .ei-a-company {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .ei-a-stock-icon {
      flex: none;
      width: 33px;
      height: 33px;
      display: grid;
      place-items: center;
      border-radius: 10px;
      background: #eaf2ff;
      color: #246bef;
      font-size: 19px;
    }

    .ei-a-company b {
      font-size: 14px;
      display: block;
      word-break: keep-all;
    }

    .ei-a-meta {
      color: #66758c;
      font-size: 11px;
      margin-top: 3px;
    }

    .ei-a-price {
      text-align: right;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 800;
    }

    .ei-a-price small {
      display: block;
      font-size: 12px;
      margin-top: 3px;
    }

    .ei-a-positive {
      color: #e44452 !important;
    }

    .ei-a-negative {
      color: #2475dc !important;
    }

    .ei-a-flat {
      color: #64748b !important;
    }

    .ei-a-card-controls {
      display: flex;
      gap: 7px;
      align-items: center;
      padding: 0 12px 8px;
    }

    .ei-a-qty {
      display: flex;
      border: 1px solid #dce4f2;
      border-radius: 10px;
      align-items: center;
      height: 36px;
      flex: 1;
      min-width: 95px;
      justify-content: space-between;
    }

    .ei-a-qty button {
      border: 0;
      background: transparent;
      font-weight: 800;
      color: #2f4c7a;
      font-size: 20px;
      width: 33px;
      height: 34px;
      touch-action: manipulation;
    }

    .ei-a-qty button:disabled {
      opacity: .25;
    }

    .ei-a-qty span {
      font-size: 13px;
      font-weight: 800;
      white-space: nowrap;
    }

    .ei-a-order {
      height: 36px;
      border: 0;
      border-radius: 9px;
      color: white;
      font-size: 13px;
      font-weight: 800;
      min-width: 52px;
      padding: 0 10px;
      touch-action: manipulation;
    }

    .ei-a-buy {
      background: #2472e8;
    }

    .ei-a-sell {
      background: #ed5365;
    }

    .ei-a-order:disabled {
      opacity: .35;
    }

    .ei-a-cost {
      margin: 0 12px 12px;
      padding: 8px 10px;
      border-radius: 8px;
      background: #f5f8fd;
      color: #52627a;
      font-size: 11px;
      line-height: 1.6;
    }

    .ei-a-cost b {
      color: #162c4a;
    }

    .ei-a-cash {
      position: sticky;
      bottom: 8px;
      z-index: 5;
      background: #e9f2ff;
      border: 1px solid #8ab5ff;
      box-shadow: 0 5px 24px rgba(12,65,144,.16);
      border-radius: 14px;
      padding: 12px 14px;
      margin: 20px 0;
    }

    .ei-a-cash-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 7px;
      flex-wrap: wrap;
    }

    .ei-a-cash span {
      font-size: 12px;
      color: #485f7f;
    }

    .ei-a-cash strong {
      font-size: 18px;
      color: #173c80;
    }

    .ei-a-hold,
    .ei-a-history {
      padding: 0 14px;
    }

    .ei-a-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eef1f6;
      font-size: 13px;
    }

    .ei-a-row:last-child {
      border-bottom: 0;
    }

    .ei-a-small {
      color: #778499;
      font-size: 11px;
      margin-top: 4px;
    }

    .ei-a-empty {
      font-size: 13px;
      color: #78869a;
      padding: 20px 0;
      text-align: center;
    }

    .ei-a-tag {
      font-size: 11px;
      border-radius: 6px;
      padding: 3px 5px;
      background: #eef4ff;
      color: #2367bc;
      font-weight: 800;
    }

    .ei-a-tag.sell {
      background: #fff0f1;
      color: #ce4355;
    }

    .ei-a-end {
      margin: 18px 0 0;
      color: #78869a;
      font-size: 12px;
      text-align: center;
    }
  `;

  document.head.appendChild(sheet);

  // 최종 A안: 간결한 스크롤형 화면
  sheet.textContent += `
    /* 하단 중복 잔액 박스 제거 */
    .ei-a-cash {
      display: none !important;
    }

    /* 뉴스 카드 */
    .ei-a-news {
      margin: 14px 0 20px;
      padding: 13px;
      background: #fff;
      border: 1px solid #e3e9f3;
      border-radius: 15px;
    }

    .ei-a-news-head {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 11px;
      font-size: 12px;
      color: #56708e;
      font-weight: 750;
    }

    .ei-a-news-head b {
      color: #2472e8;
    }

    .ei-a-news-preview {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .ei-a-news-image {
      width: 90px;
      height: 80px;
      flex-shrink: 0;
      border-radius: 10px;
      object-fit: cover;
    }

    .ei-a-news-info {
      flex: 1;
      min-width: 0;
    }

    .ei-a-news-info strong {
      font-size: 15px;
      line-height: 1.4;
      display: block;
      word-break: keep-all;
    }

    .ei-a-news-info p {
      font-size: 12px;
      color: #758196;
      line-height: 1.5;
      margin: 5px 0 0;
    }

    .ei-a-news-options {
      display: grid;
      gap: 6px;
      margin-top: 12px;
      font-size: 12px;
      line-height: 1.5;
    }

    .ei-a-news-options div {
      background: #f4f7fc;
      padding: 8px 10px;
      border-radius: 8px;
    }

    .ei-a-news-toggle {
      display: block;
      width: 100%;
      padding: 12px 0 3px;
      background: none;
      border: none;
      color: #2472e8;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
    }

    .ei-a-news-full {
      margin-top: 14px;
      border-top: 1px solid #e8edf5;
      padding-top: 8px;
    }

    /* 종목별 주문 카드 간격 줄이기 */
    .ei-a-card {
      margin: 7px 0;
      border-radius: 12px;
    }

    .ei-a-card-top {
      padding: 10px 11px 7px;
    }

    .ei-a-card-controls {
      padding: 0 11px 7px;
    }

    /* 보유주식과 최근 주문 목록 압축 */
    .ei-a-row {
      padding: 9px 0;
    }

    .ei-a-section {
      margin: 18px 0 8px;
      font-size: 17px;
    }
  `;

  // 기존 매매 기능과 Supabase 주문 RPC를 그대로 사용
  function aMarket() {
    const a = account();

    const held = STOCKS
      .map((s, i) => company(i))
      .filter(s => s.held > 0);

    const recent = state.orders
      .slice()
      .reverse()
      .slice(0, 8);

    // 내 보유주식
    const heldRows = held.map(s => `
      <div class="ei-a-row">
        <div>
          <b>${esc(s.name)}</b>

          <div class="ei-a-small">
            ${s.held}주 보유 · 현재가 ${won(s.current)}
          </div>
        </div>

        <div style="text-align:right">
          <b>${won(s.held * s.current)}</b>

          <div class="ei-a-small">
            ${s.held}주 × ${won(s.current)}
          </div>
        </div>
      </div>
    `).join('');

    // 최근 주문 내역
    const orderRows = recent.map(o => `
      <div class="ei-a-row">
        <div>
          <span class="ei-a-tag ${
            o.type === 'sell' ? 'sell' : ''
          }">
            ${o.type === 'buy' ? '매수' : '매도'}
          </span>

          <b>${esc(o.name)}</b>

          <div class="ei-a-small">
            ${o.round}라운드 · ${o.qty}주
            · 1주 ${won(o.price)}
          </div>
        </div>

        <b>${won(o.price * o.qty)}</b>
      </div>
    `).join('');

    // 8개 기업별 주문창
    const rows = STOCKS
      .map((s, i) => company(i))
      .map(s => {
        const q = orderQuantities[s.index];
        const amount = s.current * q;

        const maxBuy = Math.floor(
          state.cash / s.current
        );

        const maxSell = s.held;

        const max = Math.max(
          maxBuy,
          maxSell,
          1
        );

        const canBuy = q <= maxBuy;
        const canSell = q <= maxSell;

        // 첫 시작가 대비 확정 주가 변화
        // 아직 공개되지 않은 결과는 표시하지 않음
        const initial = STOCKS[s.index].price;

        const change = initial > 0
          ? (s.current / initial - 1) * 100
          : 0;

        const rateCls = change > 0
          ? 'ei-a-positive'
          : change < 0
            ? 'ei-a-negative'
            : 'ei-a-flat';

        const rateText = change > 0
          ? '▲ +' + change.toFixed(2) + '%'
          : change < 0
            ? '▼ ' + change.toFixed(2) + '%'
            : '― 0.00%';

        return `
          <article
            class="ei-a-card"
            aria-label="${esc(s.name)} 주문"
          >
            <div class="ei-a-card-top">
              <div class="ei-a-company">
                <span
                  class="ei-a-stock-icon"
                  aria-hidden="true"
                >
                  ${s.icon}
                </span>

                <div>
                  <b>${esc(s.name)}</b>

                  <div class="ei-a-meta">
                    ${esc(s.sector)}
                    · <strong>
                      현재 ${s.held}주 보유
                    </strong>
                  </div>
                </div>
              </div>

              <div class="ei-a-price">
                ${won(s.current)}

                <small
                  class="${rateCls}"
                  aria-label="등락률 ${rateText}"
                >
                  ${rateText}
                </small>
              </div>
            </div>

            <div class="ei-a-card-controls">
              <div class="ei-a-qty">
                <button
                  type="button"
                  data-action="quantity-minus"
                  data-value="${s.index}"
                  aria-label="${esc(s.name)} 수량 감소"
                  ${q <= 1 ? 'disabled' : ''}
                >
                  −
                </button>

                <span>${q}주 주문</span>

                <button
                  type="button"
                  data-action="quantity-plus"
                  data-value="${s.index}"
                  aria-label="${esc(s.name)} 수량 증가"
                  ${q >= max ? 'disabled' : ''}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                class="ei-a-order ei-a-buy"
                data-action="inline-buy"
                data-value="${s.index}"
                ${!canBuy ? 'disabled' : ''}
              >
                매수
              </button>

              <button
                type="button"
                class="ei-a-order ei-a-sell"
                data-action="inline-sell"
                data-value="${s.index}"
                ${!canSell ? 'disabled' : ''}
              >
                매도
              </button>
            </div>

            <div class="ei-a-cost">
              주문 금액
              <b>${won(amount)}</b>

              · 매수 후 현금
              <b>
                ${
                  canBuy
                    ? won(state.cash - amount)
                    : '현금 부족'
                }
              </b>

              <br>

              매도 후 현금
              <b>
                ${
                  canSell
                    ? won(state.cash + amount)
                    : '보유 주식 부족'
                }
              </b>
            </div>
          </article>
        `;
      }).join('');

    

    return page(`
      ${brand('ROUND ' + state.round + ' · 거래 중')}

      <div class="ei-a-screen">
        <h1 class="ei-a-heading">
          8개 기업 주문창
        </h1>

        <p class="ei-a-lead">
          현재 주가·시작가 대비 등락률·보유 주수를
          확인하고 매매하세요.
        </p>

        <div class="ei-a-summary">
          <div class="ei-a-stat">
            <small>보유 현금</small>
            <b>${won(state.cash)}</b>
          </div>

          <div class="ei-a-stat">
            <small>주식 평가액</small>
            <b>${won(a.invested)}</b>
          </div>

          <div class="ei-a-stat">
            <small>총자산</small>
            <b>${won(a.total)}</b>
          </div>
        </div>

        
        
<section class="ei-a-news">
  <div class="ei-a-news-head">
    <span>ROUND ${state.round} · 경제 뉴스</span>
    <b>결과 미공개</b>
  </div>

  <div class="ei-a-news-preview">
    <img
      src="${NEWS[state.round - 1].img}"
      alt="라운드 경제 뉴스"
      class="ei-a-news-image"
    >

    <div class="ei-a-news-info">
      <strong>
        ${esc(NEWS[state.round - 1].title)}
      </strong>
      <p>뉴스를 읽고 투자 방향을 판단하세요.</p>
    </div>
  </div>

  <div class="ei-a-news-options">
    ${NEWS[state.round - 1].options.map((option, i) => `
      <div>
        ${state.round === 3 ? '' : String.fromCharCode(65 + i) + '. '}
        ${esc(option)}
      </div>
    `).join('')}
  </div>

  <button
    type="button"
    class="ei-a-news-toggle"
    aria-expanded="${newsExpanded}"
  >
    ${newsExpanded ? '기사 접기 ▲' : '기사 전체 보기 ▼'}
  </button>

  ${newsExpanded ? `
    <div class="ei-a-news-full">
      ${newsBlock()}
    </div>
  ` : ''}
</section>



        ${rows}

        <section aria-label="내 보유주식">
          <h2 class="ei-a-section">
            내 보유주식 · ${held.length}종목
          </h2>

          <div class="ei-a-card ei-a-hold">
            ${
              heldRows ||
              '<p class="ei-a-empty">' +
              '아직 보유한 주식이 없습니다.' +
              '</p>'
            }
          </div>
        </section>

        <section aria-label="주문 내역">
          <h2 class="ei-a-section">
            최근 주문 내역
          </h2>

          <div class="ei-a-card ei-a-history">
            ${
              orderRows ||
              '<p class="ei-a-empty">' +
              '아직 체결된 주문이 없습니다.' +
              '</p>'
            }
          </div>
        </section>

        <p class="ei-a-end">
          모든 주문은 서버에서 최종 검증하고 체결됩니다.
        </p>

        <div class="ei-a-cash" aria-live="polite">
          <div class="ei-a-cash-row">
            <span>현재 거래 가능 현금</span>
            <strong>${won(state.cash)}</strong>
          </div>

          <div
            class="ei-a-cash-row"
            style="margin-top:5px"
          >
            <span>총자산 · 전체 수익률</span>

            <b>
              ${won(a.total)}

              <span class="${
                a.rate > 0
                  ? 'ei-a-positive'
                  : a.rate < 0
                    ? 'ei-a-negative'
                    : 'ei-a-flat'
              }">
                (${pct(a.rate)})
              </span>
            </b>
          </div>
        </div>
      </div>
    `, footer(
      '운영진의 거래 마감을 기다려 주세요',
      'demo-reveal'
    ));
  }

  // 기존 app.js의 거래 화면 함수만 교체
  if (
    typeof market === 'function' &&
    typeof STOCKS !== 'undefined' &&
    typeof page === 'function'
  ) {
    market = aMarket;

    if (
      typeof state !== 'undefined' &&
      state.page === 'market'
    ) {
      render();
    }
  } else {
    console.error(
      'market-a.js: app.js가 먼저 로드되어야 합니다.'
    );
  }
})();
