import React, { useState, useEffect } from 'react';
import './tongdoushun.css';

// 初始模具资产数据
const INITIAL_MOLD_DATA = [
  { id: 'M01', name: '极简直角切割器', category: '北欧极简风', weight: 1.2, rarity: '常规', price: 120 },
  { id: 'M02', name: '莫兰迪色按压模', category: '北欧极简风', weight: 1.5, rarity: '常规', price: 150 },
  { id: 'M03', name: '磨砂铝合金圆模', category: '北欧极简风', weight: 2.1, rarity: '稀有', price: 280 },
  { id: 'M04', name: '“冷淡”多边形内嵌件', category: '北欧极简风', weight: 2.8, rarity: '稀有', price: 350 },
  { id: 'M05', name: '至尊金 001 号推刀', category: '至尊镀金系列', weight: 8.5, rarity: '史诗', price: 1200 },
  { id: 'M06', name: '24K 镀金镂空脊柱', category: '至尊镀金系列', weight: 12.0, rarity: '传说', price: 3500 },
  { id: 'M07', name: '皇家金箔侧边条', category: '至尊镀金系列', weight: 6.4, rarity: '稀有', price: 850 },
  { id: 'M08', name: '奢华金喷漆关节', category: '至尊镀金系列', weight: 5.2, rarity: '常规', price: 600 },
  { id: 'M09', name: '终极镂空核心(复刻)', category: '收藏家级拍卖品', weight: 25.0, rarity: '传说', price: 8800 },
  { id: 'M10', name: '维多利亚时期蚀刻刀片', category: '收藏家级拍卖品', weight: 18.2, rarity: '传说', price: 5400 },
  { id: 'M11', name: '工业风生铁配重', category: '基础通用', weight: 0.5, rarity: '入门', price: 50 },
  { id: 'M12', name: '精准度测量外骨骼', category: '基础通用', weight: 3.2, rarity: '常规', price: 400 },
  { id: 'M13', name: '纳米级边缘修剪器', category: '高新科技', weight: 4.1, rarity: '稀有', price: 720 },
  { id: 'M14', name: '智能流体金属舱', category: '高新科技', weight: 9.7, rarity: '史诗', price: 1800 },
  { id: 'M15', name: '“呼吸”频率同步器', category: '高新科技', weight: 7.3, rarity: '稀有', price: 1100 },
  { id: 'M16', name: '机械芽叶支架', category: '基础通用', weight: 1.1, rarity: '入门', price: 90 },
  { id: 'M17', name: '磨砂哑光胸廓模', category: '北欧极简风', weight: 3.5, rarity: '稀有', price: 460 },
  { id: 'M18', name: '黄金分割比例尺', category: '至尊镀金系列', weight: 5.5, rarity: '稀有', price: 780 },
  { id: 'M19', name: '原始主义复刻刀头', category: '收藏家级拍卖品', weight: 15.0, rarity: '史诗', price: 4200 },
  { id: 'M20', name: '空间极限压缩核心', category: '收藏家级拍卖品', weight: 30.0, rarity: '传说', price: 12000 },
].map(m => ({
  ...m,
  code: Math.floor(100000 + Math.random() * 900000).toString(),
  change: (Math.random() * 10 - 5).toFixed(2)
}));

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [rank, setRank] = useState(130025); 
  const [activeTab, setActiveTab] = useState('行情');
  const [molds, setMolds] = useState(INITIAL_MOLD_DATA);
  const [watchlist, setWatchlist] = useState([]); // 自选 ID 数组
  const [ownedMolds, setOwnedMolds] = useState([]); // 已购 ID 数组

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
    setOwnedMolds([...ownedMolds, id]);
    // 购买提升排名 (数值减少)
    setRank(prev => Math.max(1, prev - (Math.floor(Math.random() * 50) + 20)));
  };

  // 5. 自选切换
  const toggleWatch = (e, id) => {
    e.stopPropagation();
    setWatchlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="potato-body"></div>
        <div className="bar-bg"><div className="bar-inner" style={{width: `${progress}%`}}></div></div>
        <p>正在断开根茎，数据同步中... {progress}%</p>
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
        {['行情', '自选', '我的'].map(tab => (
          <div 
            key={tab} 
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => isConnected || tab === '行情' ? setActiveTab(tab) : alert('请先连接根茎')}
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
          <span>{isConnected ? '断开根茎' : '连接根茎'}</span>
        </div>
      </nav>

      <div className="main-viewport">
        {activeTab === '行情' && (
          <div className="view-market">
            {/* 指数看板 */}
            <div className="indices">
              <div className="idx-card"><p>高级度指数</p><h2 className="red">4086.34</h2><small className="red">+0.16%</small></div>
              <div className="idx-card"><p>原始土豆(OPI)</p><h2 className="green">2401.32</h2><small className="green">-5.40%</small></div>
              <div className="idx-card"><p>金属饱和度</p><h2 className="green">1361.47</h2><small className="green">-0.64%</small></div>
            </div>

            {/* 市场概况 [cite: 30] */}
            <div className="section-box">
              <div className="section-header"><span>市场概况</span> <span className="more">更多</span></div>
              <div className="distribution-bar">
                <span className="up-color">涨 3283</span>
                <div className="bar-track">
                  <div className="up-fill" style={{width: '60%'}}></div>
                  <div className="down-fill" style={{width: '40%'}}></div>
                </div>
                <span className="down-color">跌 2105</span>
              </div>
            </div>

            {/* 大盘异动 - 小豆书预留位 [cite: 72, 110] */}
            <div className="section-box">
              <div className="section-header"><span>大盘异动</span> <span className="more">更多</span></div>
              <ul className="anomaly-list">
                <li><span className="tag-time">13:32</span> <b>博主 momo:</b> 今天又挖掉了5%的肉体，相关模具走强 </li>
                <li><span className="tag-time">12:10</span> <b>公告:</b> 原始土豆样本检测到未知有机物生长 </li>
                <li><span className="tag-time">10:45</span> <b>传闻:</b> “终极镂空核心”拍卖会准入名单更新 </li>
                <li><span className="tag-time">09:15</span> <b>1006 邻居:</b> 因排名暴跌锯断了家里的铁栅栏 </li>
                <li><span className="tag-time">08:00</span> <b>系统:</b> 请所有公民及时连接根茎同步高级度数据 </li>
              </ul>
            </div>

            {/* 模具行情表 */}
            <div className="table-container">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th width="35"></th>
                    <th>名称</th>
                    <th className="r">价格</th>
                    <th className="r">高级度</th>
                    <th className="r">涨幅</th>
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
                      <td className={`r digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>{m.price}</td>
                      <td className="r">+{m.weight}%</td>
                      <td className={`r digit ${parseFloat(m.change) > 0 ? 'red' : 'green'}`}>{parseFloat(m.change) > 0 ? '+' : ''}{m.change}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === '自选' && (
  <div className="view-market fade-in">
    {/* 1. 自选概览卡片 - 增加功能独特性 */}
    {watchlist.length > 0 && (
      <div className="watchlist-summary">
        <div className="sum-item">
          <label>关注模具</label>
          <p>{watchlist.length} <small>组</small></p>
        </div>
        <div className="sum-item">
          <label>平均高级度</label>
          <p>+{ (molds.filter(m => watchlist.includes(m.id)).reduce((acc, m) => acc + m.weight, 0) / watchlist.length).toFixed(1) }%</p>
        </div>
        <div className="sum-item">
          <label>市场情绪</label>
          <p className={molds.filter(m => watchlist.includes(m.id)).some(m => parseFloat(m.change) > 0) ? 'red' : 'green'}>
            {molds.filter(m => watchlist.includes(m.id)).filter(m => parseFloat(m.change) > 0).length} 涨 / {molds.filter(m => watchlist.includes(m.id)).filter(m => parseFloat(m.change) <= 0).length} 跌
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
        <h3>根茎尚未触及任何模具</h3>
        <p>你还没有在市场中锚定任何资产</p>
        <button className="go-market-btn" onClick={() => setActiveTab('行情')}>
          前往同步行情
        </button>
      </div>
    ) : (
      <div className="table-container">
        <div className="list-header">已锚定的资产清单</div>
        <table className="stock-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>价格</th>
              <th>涨跌幅度</th>
              <th>操作</th>
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
                  {m.price}
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
                    {ownedMolds.includes(m.id) ? '已嵌合' : '购买'}
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

        {activeTab === '我的' && (
          <div className="view-profile">
            <div className="puzzle-board">
               {[...Array(20)].map((_, i) => (
                 <div key={i} className={`tile ${i < ownedMolds.length ? 'gap' : ''}`}></div>
               ))}
            </div>
            <div className="user-stats">
               <p><span>当前高级度排名</span><b className="red">{rank.toLocaleString()}</b></p>
               <p><span>肉体完整度</span><b>{100 - ownedMolds.length * 5}%</b></p>
               <p><span>模具占位</span><b>{ownedMolds.length} / 20</b></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;