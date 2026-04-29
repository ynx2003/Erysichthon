import React, { useState, useEffect } from 'react';
import './tongdoushun.css';

// 初始模具资产数据
const INITIAL_MOLD_DATA = [
  { id: 'M01', name: 'Standard Elliptical Group',  weight: 8.2, rarity: 'Regular', change: 5.8, price:680 },
  { id: 'M02', name: 'Stable Structural Building Materials',  weight: 1.5, rarity: 'Regular', change: -3, price: 150 },
  { id: 'M03', name: 'Compliance Form Technology',  weight: 2.1, rarity: 'Rare', change: 3, price: 280 },
  { id: 'M04', name: 'Symmetry Technology Holdings',  weight: 2.8, rarity: 'Rare', change: 2, price: 350 },
  { id: 'M05', name: 'Surface Upgrade 1.5',  weight: 8.5, rarity: 'Epic', change: -4, price: 1200 },
  { id: 'M06', name: 'Curvature EQ 4.0.2',  weight: 12.0, rarity: 'Legend', change: 1.5, price: 3500 },
  { id: 'M07', name: 'Potato Chips Supreme Entertainment',  weight: 13.4, rarity: 'Rare', change: 9.8, price: 850 },
  { id: 'M08', name: 'Never Fall Group',  weight: 5.2, rarity: 'Regular', change: -3.2, price: 600 },
  { id: 'M09', name: 'Gregarious Adaptation Data',  weight: 4.0, rarity: 'Rare', change: -3.3, price: 380 },
  { id: 'M10', name: 'Safely Choose A Lab',  weight: 18.2, rarity: 'Legend', change: 3.7, price: 5400 },
  { id: 'M11', name: 'Natural Form Beauty',  weight: 6.5, rarity: 'Entry', change: 4, price: 850 },
  { id: 'M12', name: 'Native Shape Research',  weight: 3.2, rarity: 'Regular', change: -7.4, price: 400 },
  { id: 'M13', name: 'Compliance Protocol 6202',  weight: 4.1, rarity: 'Rare', change: -3.8, price: 720 },
  { id: 'M14', name: 'Market Adaptation Shares',  weight: 1.7, rarity: 'Entry', change: 2.1, price: 180 },
  { id: 'M15', name: 'Deviation Management Shares',  weight: 2.3, rarity: 'Rare', change: 0.5, price: 370 },
  { id: 'M16', name: 'Precision Edge Trimming',  weight: 1.1, rarity: 'Entry', change: -4.45, price: 90 },
  { id: 'M17', name: 'Highly Symmetric Technology',  weight: 7.5, rarity: 'Epic', change: 6.6, price: 1200 },
  { id: 'M18', name: 'Basic Morphology Research',  weight: 5.5, rarity: 'Rare', change: 0.12, price: 780 },
  { id: 'M19', name: 'Blank Template Entertainment',  weight: 15.0, rarity: 'Epic', change: 1, price: 4200 },
  { id: 'M20', name: 'French Fries King Entertainment',  weight: 30.0, rarity: 'Legend', change: -3.1, price: 5800 },
].map(m => ({
  ...m,
  code: Math.floor(100000 + Math.random() * 900000).toString(),
}));

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [rank, setRank] = useState(130025); 
  const [activeTab, setActiveTab] = useState('QUOTES');
  const [molds, setMolds] = useState(INITIAL_MOLD_DATA);
  const [watchlist, setwatchlist] = useState([]); // watchlist ID 数组
  const [ownedMolds, setOwnedMolds] = useState([]); // 已购 ID 数组
  const [balance, setBalance] = useState(10000); //玩家初始资金

  // 1. 加载模拟
  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(p => p + 5), 50);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setLoading(false), 500);
    }
  }, [progress]);

  // 2. 排名实时跌落 (每3秒 +1~20)
  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => {
        setRank(prev => prev + Math.floor(Math.random() * 20) + 1);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // 3. 价格波动
  useEffect(() => {
    const interval = setInterval(() => {
      setMolds(prev => prev.map(m => ({
        ...m,
        change: (parseFloat(m.change) + (Math.random() * 0.4 - 0.2)).toFixed(2)
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 4. 购买/嵌合逻辑
  const handleBuy = (id) => {
  if (!isConnected || ownedMolds.includes(id)) return;
    // 找到对应的模具数据以获取当前价格和涨幅
  const target = molds.find(m => m.id === id);
  if (!target) return;
    // 计算实时价格：基础价格 * (1 + 涨幅)
  const currentPrice = target.price * (1 + parseFloat(target.change) / 100);
    // 余额检查
  if (balance < currentPrice) {
    alert('Insufficient Balance!');
    return;
  }
    // 扣款并更新资产
  setBalance(prev => prev - currentPrice);
  setOwnedMolds([...ownedMolds, id]);
    // 购买提升排名
  setRank(prev => Math.max(1, prev - (Math.floor(Math.random() * 50) + 20)));
};

  // 5. watchlist切换
  const toggleWatch = (e, id) => {
    e.stopPropagation();
    setwatchlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="potato-body"></div>
        <div className="bar-bg"><div className="bar-inner" style={{width: `${progress}%`}}></div></div>
        <p>Disconnecting Rootstock, Synchronizing Data... {progress}%</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* 顶部幽灵排名 */}
      {isConnected && (
        <div className="ghost-hud">
          <div className="hud-wrap">
            <span className="hud-tag">RANKING</span>
            <span className="hud-num">{rank.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 底部导航栏 */}
      <nav className="nav-bottom">
        {['QUOTES', 'WATCHLIST', 'HOME'].map(tab => (
          <div 
            key={tab} 
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => isConnected || tab === 'QUOTES' ? setActiveTab(tab) : alert('Please Connect the Rootstock!')}
          >
            <div className={`nav-icon icon-${tab}`}></div>
            <span>{tab}</span>
          </div>
        ))}
        <div 
          className={`nav-btn conn-toggle ${isConnected ? 'on' : ''}`}
          onClick={() => setIsConnected(!isConnected)}
        >
          <div className="nav-icon icon-power"></div>
          <span>{isConnected ? 'Disconnect the Rootstock' : 'Connect the Rootstock'}</span>
        </div>
      </nav>

      <div className="main-viewport">
        {activeTab === 'QUOTES' && (
          <div className="view-market">
            {/* 指数看板 */}
            <div className="indices">
              <div className="idx-card"><p>Advanced Degree Index</p><h2 className="red">4086.34</h2><small className="red">+0.16%</small></div>
              <div className="idx-card"><p>Original Potato Index</p><h2 className="green">2401.32</h2><small className="green">-5.40%</small></div>
              <div className="idx-card"><p>Metal Saturation Index</p><h2 className="red">1361.47</h2><small className="red">+4.64%</small></div>
            </div>

            {/* 市场概况 */}
            <div className="section-box">
              <div className="section-header"><span>Market Overview</span> <span className="more">More</span></div>
              <div className="distribution-bar">
                <span className="up-color">RISE 3283</span>
                <div className="bar-track">
                  <div className="up-fill" style={{width: '60%'}}></div>
                  <div className="down-fill" style={{width: '40%'}}></div>
                </div>
                <span className="down-color">FALL 2105</span>
              </div>
            </div>

            {/* 大盘异动 - 小豆书预留位 */}
            <div className="section-box">
              <div className="section-header"><span>Market Anomaly News</span> <span className="more">More</span></div>
              <ul className="anomaly-list">
                <li>
                  <span className="tag-time">13:32</span> 
                  <div className="anomaly-content">Official government release: The standard ellipse is the optimal shape</div>
                </li>
                <li>
                  <span className="tag-time">12:10</span>
                  <div className="anomaly-content">Dou Star Same Style! Potato Chips Supreme Entertainment Approaches Limit-Up</div>
                </li>
                <li>
                  <span className="tag-time">10:45</span>
                  <div className="anomaly-content">Dream of original aesthetics shattered? The sharp plunge of Native Shape Research…</div>
                </li>
                <li>
                  <span className="tag-time">09:15</span>
                  <div className="anomaly-content">Angularized shapes may affect the consistency of the overall visual perception</div>
                </li>
                <li>
                  <span className="tag-time">08:00</span>
                  <div className="anomaly-content">High symmetry has become a social necessity, and the technology sector continues to strengthen</div>
                </li>
              </ul>
            </div>

            {/* 模具行情表 */}
            <div className="table-container">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th width="35"></th>
                    <th>STOCK</th>
                    <th className="r">PRICE</th>
                    <th className="r">ADVANCE DEGREE</th>
                    <th className="r">%CHG</th>
                  </tr>
                </thead>
                <tbody>
                  {molds.map(m => (
                    <tr key={m.id}>
                      <td className="c">
                        <button 
                          className={`watch-add ${watchlist.includes(m.id) ? 'active' : ''}`}
                          onClick={(e) => toggleWatch(e, m.id)}
                        >
                          {watchlist.includes(m.id) ? '−' : '+'}
                        </button>
                      </td>
                      <td><div className="name-box"><span>{m.name}</span><small>{m.code}</small></div></td>
                      <td className={`r digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>{(m.price * (1 + parseFloat(m.change) / 100)).toFixed(2)}</td>
                      <td className="r">+{m.weight}%</td>
                      <td className={`r digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>{parseFloat(m.change) > 0 ? '+' : ''}{m.change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'WATCHLIST' && (
  <div className="view-market fade-in">
    {/* 1. watchlist概览卡片 - 增加功能独特性 */}
    {watchlist.length > 0 && (
      <div className="watchlist-summary">
        <div className="sum-item">
          <label>FOLLOWING</label>
          <p>{watchlist.length}</p>
        </div>
        <div className="sum-item">
          <label>AVERAGE ADVANCE DEGREE</label>
          <p>+{ (molds.filter(m => watchlist.includes(m.id)).reduce((acc, m) => acc + m.weight, 0) / watchlist.length).toFixed(1) }%</p>
        </div>
        <div className="sum-item">
          <label>MARKET SENTIMENT</label>
          <p className={molds.filter(m => watchlist.includes(m.id)).some(m => parseFloat(m.change) > 0) ? 'red' : 'green'}>
            {molds.filter(m => watchlist.includes(m.id)).filter(m => parseFloat(m.change) > 0).length} RISE / {molds.filter(m => watchlist.includes(m.id)).filter(m => parseFloat(m.change) <= 0).length} FALL
          </p>
        </div>
      </div>
    )}

    {/* 2. 条件渲染内容 */}
    {watchlist.length === 0 ? (
      <div className="empty-watchlist">
        <div className="empty-art">
          <div className="void-circle"></div>
          <div className="root-line"></div>
        </div>
        <h3>You haven't anchored any assets in the market</h3>
        <button className="go-market-btn" onClick={() => setActiveTab('QUOTES')}>
          Go to synchronize market quotes
        </button>
      </div>
    ) : (
      <div className="table-container">
        <div className="list-header">Anchored Asset List</div>
        <table className="stock-table">
          <thead>
            <tr>
              <th>STOCK</th>
              <th>PRICE</th>
              <th>%CHG</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {molds.filter(m => watchlist.includes(m.id)).map(m => (
              <tr key={m.id}>
                <td>
                  <div className="name-box">
                    <span>{m.name}</span>
                    <small>{m.code} · {m.rarity}</small>
                  </div>
                </td>
                <td className={`digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>
                  {(m.price * (1 + parseFloat(m.change) / 100)).toFixed(2)}
                </td>
                <td className={`digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>
                  {parseFloat(m.change) > 0 ? '+' : '-'} {Math.abs(m.change)}%
                </td>
                <td>
                  <button 
                    className={`buy-action ${ownedMolds.includes(m.id) ? 'done' : ''}`}
                    onClick={() => handleBuy(m.id)}
                    disabled={ownedMolds.includes(m.id)}
                  >
                    {ownedMolds.includes(m.id) ? 'EMBEDED' : 'BUY'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

       {activeTab === 'HOME' && (
  (() => {
    const n = ownedMolds.length;
    const integrity = (100 * Math.pow(0.5, n)).toFixed(n > 5 ? 4 : 2);

    return (
      <div className="view-profile">
        <div className="puzzle-board" style={{ display: 'flex', alignItems: 'flex-end', background: '#1a1410' }}>
           <div 
             className="potato-flesh-indicator" 
             style={{ 
               width: '100%', 
               height: `${Math.max(0.1, 100 * Math.pow(0.5, n))}%`, 
               background: '#5d4037',
               transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
             }}
           ></div>
        </div>

        <div className="user-stats">
           <p><span>Balance</span><b className="green">{balance.toFixed(2)}</b></p>
           <p><span>Rank of Advance Degree</span><b className="red">{rank.toLocaleString()}</b></p>
           <p><span>Physical Integrity</span><b>{integrity}%</b></p>
           <p><span>Number of Embedded Mold</span><b>{n}</b></p>
        </div>
      </div>
    );
  })()
)}
      </div>
    </div>
  );
}
export default App;