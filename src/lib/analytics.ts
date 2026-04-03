import { ReportHandler } from 'web-vitals';

// 性能指标上报
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// 发送到分析端点（可选）
export const sendToAnalytics = (metric: any) => {
  const body = {
    dsn: 'YOUR_GOOGLE_ANALYTICS_ID', // 替换为你的 GA ID
    id: metric.id,
    name: metric.name,
    value: metric.value,
    timestamp: Date.now(),
    navigationType: metric.navigationType,
  };

  // 发送到分析服务
  navigator.sendBeacon('/api/analytics', JSON.stringify(body));
  
  // 开发环境输出到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
};

export { reportWebVitals };
