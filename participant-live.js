
/*
 * ECONIGHT INVEST
 * Supabase 참가자 서버 연결 모듈
 */

window.ECONIGHT_LIVE = (() => {
  const url = window.ECONIGHT_SUPABASE_URL;
  const key = window.ECONIGHT_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || !window.supabase) {
    throw new Error(
      'Supabase 설정 또는 라이브러리를 확인해주세요.'
    );
  }

  const db = window.supabase.createClient(url, key);

  // 기존 참가자 로그인 세션 확인
  async function getSession() {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  // 참가자 익명 로그인 및 이름 등록
  async function register(name) {
    const cleanName = String(name || '').trim();

    if (cleanName.length < 1 || cleanName.length > 20) {
      throw new Error('이름은 1~20자로 입력해주세요.');
    }

    let session = await getSession();

    if (!session) {
      const { data, error } =
        await db.auth.signInAnonymously();

      if (error) throw error;
      session = data.session;
    }

    // 관리자 로그인 세션으로 참가자 등록 방지
    if (!session.user.is_anonymous) {
      throw new Error(
        '관리자 계정이 로그인되어 있습니다. ' +
        '참가자 전용 브라우저에서 접속해주세요.'
      );
    }

    const { data, error } = await db.rpc(
      'ei_register_participant',
      { p_name: cleanName }
    );

    if (error) throw error;
    return data;
  }

  // 내 현금·보유 주식·수익률·거래 내역
  async function getAccount() {
    const { data, error } = await db.rpc(
      'ei_get_my_account'
    );

    if (error) throw error;
    return data;
  }

  // 서버에서 진행 중인 라운드 확인
  async function getGame() {
    const { data, error } = await db
      .from('ei_game')
      .select(
        'round_no,phase,prices,changes,published_result'
      )
      .eq('id', 1)
      .single();

    if (error) throw error;
    return data;
  }

  // 서버 검증 매수·매도
  async function placeOrder(
    stockIndex,
    side,
    quantity,
    requestId
  ) {
    const id = requestId || crypto.randomUUID();

    const { data, error } = await db.rpc(
      'ei_place_order',
      {
        p_stock_index: stockIndex,
        p_side: side,
        p_quantity: quantity,
        p_request_id: id
      }
    );

    if (error) throw error;

    return {
      ...data,
      request_id: id
    };
  }

  // 실제 참가자 최종 순위 조회
  async function getLeaderboard() {
    const { data, error } = await db.rpc(
      'ei_get_leaderboard'
    );

    if (error) throw error;

    return data.rankings;
  }


  
   
  return {
    db,
    getSession,
    register,
    getAccount,
    getGame,
    placeOrder,
    getLeaderboard
  };

})();
