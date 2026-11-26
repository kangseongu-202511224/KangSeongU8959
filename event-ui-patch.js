
/* ECONIGHT INVEST · 참가자 화면 개선 */
(() => {
  'use strict';

  if (
    typeof market !== 'function' ||
    typeof state === 'undefined'
  ) {
    console.error('app.js 로드 순서를 확인하세요.');
    return;
  }

  const warnings = Object.create(null);
  const originalMarket = market;

  const style = document.createElement('style');
  style.textContent = `
    .ei-a-cost,
    .ei-a-cash {
      display: none !important;
    }

    .ei-quantity-input {
      width: 48px;
      text-align: center;
      border: 0;
      background: transparent;
      color: #172a49;
      font: 800 14px system-ui;
    }

    .ei-max-warning {
      padding: 0 12px 10px;
      color: #d53043;
      font-size: 12px;
      font-weight: 750;
      line-height: 1.5;
    }

    .ei-a-card button {
      touch-action: manipulation;
    }

    .ei-rank-secret {
      font-size: 14px;
      color: #64748b;
      padding: 10px 14px;
      margin-top: 12px;
      background: #f4f7fc;
      border-radius: 10px;
    }
  `;
  document.head.appendChild(style);

  function maxBuy(i) {
    const price = Number(state.prices[i]);

    return price > 0
      ? Math.max(0, Math.floor(state.cash / price))
      : 0;
  }

  function maxOrder(i) {
    const held = Number(
      state.holdings[STOCKS[i].code]
    ) || 0;

    return Math.max(1, maxBuy(i), held);
  }

  function warningText(i) {
    return (
      `${STOCKS[i].name}은 현재 현금으로 ` +
      `최대 ${maxBuy(i)}주까지 매수할 수 있습니다.`
    );
  }

  function changeQty(i, value) {
    if (
      !Number.isInteger(i) ||
      i < 0 ||
      i >= STOCKS.length
    ) return;

    const requested = Math.trunc(Number(value));
    if (!Number.isFinite(requested)) return;

    if (requested > maxBuy(i)) {
      warnings[i] = warningText(i);
    } else {
      delete warnings[i];
    }

    orderQuantities[i] = Math.max(
      1,
      Math.min(maxOrder(i), requested)
    );

    render();
  }

  market = function enhancedMarket() {
    const template = document.createElement('template');
    template.innerHTML = originalMarket();

    const screen = template.content.querySelector(
      '.ei-a-screen'
    );

    if (!screen) return template.innerHTML;
    
    // 자산 현황을 주문 화면 맨 아래로 이동
    const assetSummary = screen.querySelector(
      '.ei-a-summary'
    );

    if (assetSummary) {
      screen.appendChild(assetSummary);
    }

    // 수량은 직접 입력만 사용하므로 +/- 버튼 제거
    screen.querySelectorAll(
      '[data-action="quantity-plus"],' +
      '[data-action="quantity-minus"]'
    ).forEach(button => button.remove());

    // 중복 주문 금액 및 잔액 영역 삭제
    screen.querySelectorAll(
      '.ei-a-cost, .ei-a-cash'
    ).forEach(el => el.remove());

    // 제목을 매매 목록 아래, 보유주식 위로 이동
    const heading = screen.querySelector('.ei-a-heading');

    const holdings = screen.querySelector(
      'section[aria-label="내 보유주식"]'
    );

    if (heading && holdings) {
      heading.textContent = '8개 기업 주문창';
      heading.remove();
      holdings.before(heading);
    }

    const cards = screen.querySelectorAll(
      '.ei-a-card[aria-label$=" 주문"]'
    );

    cards.forEach((card, i) => {
      const controls = card.querySelector('.ei-a-qty');
      if (!controls) return;

      // 기존 주문 수량 표시를 숫자 입력창으로 변경
      const oldQty = controls.querySelector('span');

      if (oldQty) {
        const field = document.createElement('input');

        field.type = 'number';
        field.inputMode = 'numeric';
        field.min = '1';
        field.max = String(maxOrder(i));
        field.step = '1';

        field.value = String(orderQuantities[i]);
        field.className = 'ei-quantity-input';
        field.dataset.eiQty = String(i);

        field.setAttribute(
          'aria-label',
          `${STOCKS[i].name} 주문 수량`
        );

        oldQty.replaceWith(field);
      }

      const plus = controls.querySelector(
        '[data-action="quantity-plus"]'
      );

      const minus = controls.querySelector(
        '[data-action="quantity-minus"]'
      );

      if (plus) {
        plus.disabled = false;
        plus.dataset.action = 'ei-plus';
      }

      if (minus) {
        minus.dataset.action = 'ei-minus';
      }

     
      
  

     
      // 직전 라운드에서 확정된 실제 등락률 표시
      const rate = card.querySelector(
        '.ei-a-price small'
      );

      if (rate) {
        const previousRates = state.previousRoundChanges;

        const hasPreviousRate =
          state.round >= 2 &&
          Array.isArray(previousRates) &&
          previousRates.length === STOCKS.length &&
          previousRates[i] !== null &&
          previousRates[i] !== undefined &&
          Number.isFinite(Number(previousRates[i]));

        if (state.round === 1) {
          rate.textContent = '대회 시작가';
          rate.className = 'ei-a-flat';

        } else if (!hasPreviousRate) {
          rate.textContent =
            '직전 라운드 등락률 불러오는 중';
          rate.className = 'ei-a-flat';

        } else {
          const change = Number(previousRates[i]);

          const direction = change > 0
            ? '▲ +'
            : change < 0
              ? '▼ '
              : '― ';

          rate.textContent =
            `${state.round - 1}라운드 변동률 ` +
            `${direction}${change.toFixed(2)}%`;

          rate.className = change > 0
            ? 'ei-a-positive'
            : change < 0
              ? 'ei-a-negative'
              : 'ei-a-flat';
        }
      }


      if (warnings[i]) {
        const notice = document.createElement('div');

        notice.className = 'ei-max-warning';
        notice.setAttribute('role', 'alert');
        notice.textContent = warnings[i];

        card.appendChild(notice);
      }
    });

    return template.innerHTML;
  };

  // 거래 종료 전까지 실제 순위 비공개
  for (const type of ['briefing', 'result']) {
    const original = type === 'briefing'
      ? briefing
      : result;

    const wrapped = function () {
      const html = original();

      if (
        type === 'briefing' &&
        state.round < 2
      ) return html;

      const template = document.createElement('template');
      template.innerHTML = html;

      const main = template.content.querySelector('main');

      if (main) {
        const rank = document.createElement('div');

        rank.className = 'ei-rank-secret';
        rank.textContent =
          '현재 순위 : ??? (최종 발표 후 공개)';

        main.appendChild(rank);
      }

      return template.innerHTML;
    };

    if (type === 'briefing') {
      briefing = wrapped;
    } else {
      result = wrapped;
    }
  }

  // + / - 버튼
  document.addEventListener('click', event => {
    const button = event.target.closest(
      '[data-action="ei-plus"],' +
      '[data-action="ei-minus"]'
    );

    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const i = Number(button.dataset.value);
    const delta = button.dataset.action === 'ei-plus'
      ? 1
      : -1;

    changeQty(i, (orderQuantities[i] || 1) + delta);
  }, true);

 
  // 키보드 입력 시 화면을 다시 그리지 않고 수량만 저장
  function updateQuantityField(field) {
    const i = Number(field.dataset.eiQty);
    if (!Number.isInteger(i) || i < 0 || i >= STOCKS.length) return;

    const card = field.closest('.ei-a-card');
    if (!card) return;

    const buy = card.querySelector('[data-action="inline-buy"]');
    const sell = card.querySelector('[data-action="inline-sell"]');
    const plus = card.querySelector('[data-action="ei-plus"]');
    const minus = card.querySelector('[data-action="ei-minus"]');

    const raw = field.value;

    // 입력 중 잠깐 비어 있을 때는 초기화하지 않음
    if (raw === '') {
      if (buy) buy.disabled = true;
      if (sell) sell.disabled = true;
      return;
    }

    const typed = Number(raw);
    if (!Number.isFinite(typed)) return;

    const limit = maxOrder(i);
    const cashLimit = maxBuy(i);
    const held = Number(state.holdings[STOCKS[i].code]) || 0;

    const qty = Math.max(
      1,
      Math.min(limit, Math.trunc(typed))
    );

    // 현금 초과 입력은 제한하고 경고 표시
    if (typed > cashLimit) {
      warnings[i] = warningText(i);
    } else {
      delete warnings[i];
    }

    orderQuantities[i] = qty;

    if (typed !== qty) {
      field.value = String(qty);
    }

    // 입력한 수량에 맞춰 버튼 상태 변경
    if (buy) buy.disabled = qty > cashLimit;
    if (sell) sell.disabled = qty > held;
    if (plus) plus.disabled = qty >= limit;
    if (minus) minus.disabled = qty <= 1;

    let notice = card.querySelector('.ei-max-warning');

    if (warnings[i]) {
      if (!notice) {
        notice = document.createElement('div');
        notice.className = 'ei-max-warning';
        notice.setAttribute('role', 'alert');
        card.appendChild(notice);
      }
      notice.textContent = warnings[i];
    } else {
      notice?.remove();
    }
  }

  document.addEventListener('input', event => {
    if (event.target.matches('.ei-quantity-input')) {
      updateQuantityField(event.target);
    }
  }, true);

  // 입력 완료 시에도 render()를 실행하지 않음
  document.addEventListener('change', event => {
    if (!event.target.matches('.ei-quantity-input')) return;

    const field = event.target;

    if (field.value === '') {
      field.value = '1';
    }

    updateQuantityField(field);
  }, true);



  // 모바일 확대 방지
  const viewport = document.querySelector(
    'meta[name="viewport"]'
  );

  if (viewport) {
    viewport.content =
      'width=device-width, initial-scale=1,' +
      ' maximum-scale=1, user-scalable=no,' +
      ' viewport-fit=cover';
  }

  if (state.page === 'market') render();
})();
