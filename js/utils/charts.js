// Sample data for the chart
const salesData = [
  { month: 'Jan', sales: 4500, orders: 120, revenue: 65000 },
  { month: 'Feb', sales: 5200, orders: 150, revenue: 72000 },
  { month: 'Mar', sales: 4800, orders: 130, revenue: 68000 },
  { month: 'Apr', sales: 6000, orders: 170, revenue: 85000 },
  { month: 'May', sales: 5700, orders: 160, revenue: 79000 },
  { month: 'Jun', sales: 6500, orders: 180, revenue: 92000 }
];

// Initialize chart
function initializeChart(timeRange) {
  // Make sure Recharts is loaded
  if (typeof Recharts === 'undefined') {
    console.error('Recharts library not loaded');
    return;
  }

  const chartContainer = document.getElementById('revenue-chart');
  if (!chartContainer) return;
  
  // Clear previous chart to prevent stacking
  chartContainer.innerHTML = '';

  // Filter data based on time range if needed
  let filteredData = salesData;
  if (timeRange === 'week') {
    // For demo, just use the last 2 months
    filteredData = salesData.slice(-2);
  } else if (timeRange === 'day') {
    // For demo, just use the last month
    filteredData = salesData.slice(-1);
  }

  // Add a few calculated fields to each data point
  filteredData = filteredData.map((item, index) => {
    // Add growth percentage from previous month where applicable
    const growth = index > 0 
      ? ((item.revenue - filteredData[index-1].revenue) / filteredData[index-1].revenue) * 100
      : 0;
    
    return {
      ...item,
      growth: growth.toFixed(1),
      isPositive: growth >= 0,
      revenueFormatted: `$${(item.revenue/1000).toFixed(1)}k`
    };
  });

  // Create chart using Recharts
  const { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } = Recharts;
  
  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            padding: '14px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(230, 230, 230, 0.7)',
            minWidth: '180px'
          }
        }, [
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px'
            }
          }, [
            React.createElement('div', {
              style: {
                backgroundColor: '#4f46e5',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                marginRight: '8px'
              }
            }),
            React.createElement('span', {
              style: {
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937'
              }
            }, label)
          ]),
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
              marginTop: '4px'
            }
          }, [
            React.createElement('span', {
              style: {
                fontSize: '13px',
                color: '#6b7280'
              }
            }, 'Revenue:'),
            React.createElement('span', {
              style: {
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827'
              }
            }, `$${dataPoint.revenue.toLocaleString()}`)
          ]),
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: index > 0 ? '8px' : '0px'
            }
          }, [
            React.createElement('span', {
              style: {
                fontSize: '13px',
                color: '#6b7280'
              }
            }, 'Sales:'),
            React.createElement('span', {
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }
            }, `$${dataPoint.sales.toLocaleString()}`)
          ]),
          index > 0 && React.createElement('div', {
            style: {
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px dashed #e5e7eb',
              display: 'flex',
              alignItems: 'center'
            }
          }, [
            React.createElement('span', {
              style: {
                fontSize: '13px',
                color: dataPoint.isPositive ? '#059669' : '#e11d48',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center'
              }
            }, [
              React.createElement('span', {
                style: {
                  marginRight: '4px'
                }
              }, dataPoint.isPositive ? '↑' : '↓'),
              `${Math.abs(dataPoint.growth)}%`
            ]),
            React.createElement('span', {
              style: {
                fontSize: '12px',
                color: '#6b7280',
                marginLeft: '4px'
              }
            }, ' from last month')
          ])
        ])
      );
    }
    return null;
  };
  
  // Create the chart component
  const chart = React.createElement(
    ResponsiveContainer,
    { width: '100%', height: '100%' },
    React.createElement(
      AreaChart,
      { 
        data: filteredData,
        margin: { top: 10, right: 10, left: 0, bottom: 10 }
      },
      [
        // Create gradient definitions
        React.createElement('defs', null, [
          // Main area gradient
          React.createElement('linearGradient', { id: 'colorRevenue', x1: 0, y1: 0, x2: 0, y2: 1 },
            [
              React.createElement('stop', { offset: '5%', stopColor: '#4f46e5', stopOpacity: 0.25 }),
              React.createElement('stop', { offset: '95%', stopColor: '#4f46e5', stopOpacity: 0.03 })
            ]
          ),
          // Fancier gradient with multiple stops
          React.createElement('linearGradient', { id: 'fancyGradient', x1: 0, y1: 0, x2: 0, y2: 1 },
            [
              React.createElement('stop', { offset: '0%', stopColor: '#7c3aed', stopOpacity: 0.15 }),
              React.createElement('stop', { offset: '45%', stopColor: '#4f46e5', stopOpacity: 0.15 }),
              React.createElement('stop', { offset: '95%', stopColor: '#3b82f6', stopOpacity: 0.05 })
            ]
          ),
          // Soft background grid
          React.createElement('filter', { id: 'softBlur' }, 
            React.createElement('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '0.7' })
          )
        ]),
        
        // Custom background - soft grid
        React.createElement(CartesianGrid, { 
          strokeDasharray: '2 4', 
          stroke: '#f3f4f6',
          vertical: false,
          strokeWidth: 1,
          filter: 'url(#softBlur)'
        }),
        
        // X-axis configuration - removed lines, just labels
        React.createElement(XAxis, { 
          dataKey: 'month', 
          axisLine: false,
          tickLine: false,
          tick: { 
            fill: '#6b7280', 
            fontSize: 12,
            fontWeight: 500
          },
          dy: 10,
          padding: { left: 20, right: 20 }
        }),
        
        // Y-axis configuration - minimal styling
        React.createElement(YAxis, { 
          axisLine: false,
          tickLine: false,
          tick: { 
            fill: '#9ca3af', 
            fontSize: 12 
          },
          tickFormatter: (value) => `$${value/1000}k`,
          width: 50,
          padding: { top: 20 }
        }),
        
        // Zero reference line - subtle indicator
        React.createElement(ReferenceLine, { 
          y: 0,
          stroke: '#e5e7eb',
          strokeWidth: 1,
          strokeDasharray: '6 2'
        }),
        
        // Custom tooltip
        React.createElement(Tooltip, { 
          content: CustomTooltip,
          cursor: { 
            stroke: '#9ca3af', 
            strokeDasharray: '3 3', 
            strokeWidth: 1
          }
        }),
        
        // The primary data visualization - smooth curve area
        React.createElement(Area, { 
          type: 'monotone',
          dataKey: 'revenue',
          stroke: '#4f46e5',
          strokeWidth: 3,
          fill: 'url(#fancyGradient)',
          activeDot: { 
            r: 6, 
            stroke: '#ffffff',
            strokeWidth: 3,
            fill: '#4f46e5',
            boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)'
          },
          animationDuration: 1500,
          animationEasing: 'ease-in-out'
        })
      ]
    )
  );

  // Render the chart
  ReactDOM.render(chart, chartContainer);
}

// Alternative solution using SVG for more modern design
function renderSimpleChart(timeRange) {
  const chartContainer = document.getElementById('revenue-chart');
  if (!chartContainer) return;
  
  // Clear previous chart contents
  chartContainer.innerHTML = '';

  // Create a modern SVG chart as fallback
  const svgWidth = chartContainer.clientWidth || 600;
  // Use the container's height or fall back to a reasonable default
  const svgHeight = chartContainer.clientHeight || 450;
  const padding = { left: 50, right: 20, top: 30, bottom: 30 };
  
  // Filter data based on time range if needed
  let filteredData = salesData;
  if (timeRange === 'week') {
    filteredData = salesData.slice(-2);
  } else if (timeRange === 'day') {
    filteredData = salesData.slice(-1);
  }
  
  // Calculate scale
  const maxRevenue = Math.max(...filteredData.map(d => d.revenue));
  const xScale = (svgWidth - padding.left - padding.right) / Math.max((filteredData.length - 1), 1);
  const yScale = (svgHeight - padding.top - padding.bottom) / maxRevenue;
  
  // Create SVG with rounded corners
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', svgHeight);
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute('style', 'overflow: visible;'); // Allow dots to overflow
  
  // Create fancy gradient for area
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // Fancy gradient with multiple stops
  const fancyGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  fancyGradient.setAttribute('id', 'fancyGradientSvg');
  fancyGradient.setAttribute('x1', '0');
  fancyGradient.setAttribute('y1', '0');
  fancyGradient.setAttribute('x2', '0');
  fancyGradient.setAttribute('y2', '1');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#7c3aed');
  stop1.setAttribute('stop-opacity', '0.15');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '45%');
  stop2.setAttribute('stop-color', '#4f46e5');
  stop2.setAttribute('stop-opacity', '0.15');
  
  const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop3.setAttribute('offset', '95%');
  stop3.setAttribute('stop-color', '#3b82f6');
  stop3.setAttribute('stop-opacity', '0.05');
  
  fancyGradient.appendChild(stop1);
  fancyGradient.appendChild(stop2);
  fancyGradient.appendChild(stop3);
  
  // Filter for soft blur effect
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'softBlurSvg');
  
  const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
  feGaussianBlur.setAttribute('in', 'SourceGraphic');
  feGaussianBlur.setAttribute('stdDeviation', '0.7');
  
  filter.appendChild(feGaussianBlur);
  
  // Shadow for dots
  const dropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  dropShadow.setAttribute('id', 'dropShadow');
  dropShadow.setAttribute('x', '-20%');
  dropShadow.setAttribute('y', '-20%');
  dropShadow.setAttribute('width', '140%');
  dropShadow.setAttribute('height', '140%');
  
  const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
  feDropShadow.setAttribute('dx', '0');
  feDropShadow.setAttribute('dy', '0');
  feDropShadow.setAttribute('stdDeviation', '3');
  feDropShadow.setAttribute('flood-color', 'rgba(79, 70, 229, 0.2)');
  
  dropShadow.appendChild(feDropShadow);
  
  defs.appendChild(fancyGradient);
  defs.appendChild(filter);
  defs.appendChild(dropShadow);
  svg.appendChild(defs);
  
  // Create smooth curve path for line and area
  const points = filteredData.map((item, index) => {
    const x = padding.left + index * xScale;
    const y = svgHeight - padding.bottom - (item.revenue * yScale);
    return { x, y };
  });
  
  // Generate smooth path
  const smoothPath = generateSmoothPath(points, false);
  const smoothArea = generateSmoothPath(points, true, svgHeight - padding.bottom);
  
  // Create area with gradient
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', smoothArea);
  area.setAttribute('fill', 'url(#fancyGradientSvg)');
  area.setAttribute('opacity', '1');
  
  // Create smooth curve line
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', smoothPath);
  path.setAttribute('stroke', '#4f46e5');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('fill', 'none');
  
  // Add soft grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('filter', 'url(#softBlurSvg)');
  
  for (let i = 1; i <= 4; i++) {
    const y = padding.top + (svgHeight - padding.top - padding.bottom) * (i / 5);
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', padding.left);
    gridLine.setAttribute('y1', y);
    gridLine.setAttribute('x2', svgWidth - padding.right);
    gridLine.setAttribute('y2', y);
    gridLine.setAttribute('stroke', '#f3f4f6');
    gridLine.setAttribute('stroke-dasharray', '2 4');
    gridLine.setAttribute('stroke-width', '1');
    
    gridGroup.appendChild(gridLine);
  }
  
  svg.appendChild(gridGroup);
  
  // Add data points with animation and interaction
  points.forEach((point, index) => {
    const item = filteredData[index];
    
    // Add month labels on X-axis
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = item.month;
    text.setAttribute('x', point.x);
    text.setAttribute('y', svgHeight - padding.bottom + 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', '500');
    text.setAttribute('fill', '#6b7280');
    
    // Add data point circles with interactive hover
    const circleGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    circleGroup.setAttribute('class', 'data-point-group');
    
    // Inner circle (visible always)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', '#4f46e5');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('class', 'data-point');
    
    // Outer circle (only visible on hover)
    const hoverCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hoverCircle.setAttribute('cx', point.x);
    hoverCircle.setAttribute('cy', point.y);
    hoverCircle.setAttribute('r', '10');
    hoverCircle.setAttribute('fill', 'transparent');
    hoverCircle.setAttribute('stroke', 'rgba(79, 70, 229, 0.2)');
    hoverCircle.setAttribute('stroke-width', '2');
    hoverCircle.setAttribute('class', 'hover-circle');
    
    circleGroup.appendChild(hoverCircle);
    circleGroup.appendChild(circle);
    
    // Create tooltip for data point
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('x', point.x - 90);
    foreignObject.setAttribute('y', point.y - 100);
    foreignObject.setAttribute('width', '180');
    foreignObject.setAttribute('height', '90');
    foreignObject.setAttribute('class', 'tooltip-container');
    
    const tooltipDiv = document.createElement('div');
    tooltipDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.97)';
    tooltipDiv.style.padding = '12px';
    tooltipDiv.style.borderRadius = '10px';
    tooltipDiv.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    tooltipDiv.style.border = '1px solid rgba(230, 230, 230, 0.7)';
    tooltipDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    tooltipDiv.style.fontSize = '13px';
    tooltipDiv.style.display = 'none';
    
    const tooltipContent = document.createElement('div');
    
    // Month label
    const monthLabel = document.createElement('div');
    monthLabel.style.display = 'flex';
    monthLabel.style.alignItems = 'center';
    monthLabel.style.marginBottom = '8px';
    
    const monthDot = document.createElement('div');
    monthDot.style.backgroundColor = '#4f46e5';
    monthDot.style.width = '8px';
    monthDot.style.height = '8px';
    monthDot.style.borderRadius = '50%';
    monthDot.style.marginRight = '6px';
    
    const monthText = document.createElement('span');
    monthText.textContent = item.month;
    monthText.style.fontWeight = '600';
    monthText.style.fontSize = '14px';
    monthText.style.color = '#1f2937';
    
    monthLabel.appendChild(monthDot);
    monthLabel.appendChild(monthText);
    tooltipContent.appendChild(monthLabel);
    
    // Revenue value
    const revRow = document.createElement('div');
    revRow.style.display = 'flex';
    revRow.style.justifyContent = 'space-between';
    revRow.style.marginBottom = '4px';
    
    const revLabel = document.createElement('span');
    revLabel.textContent = 'Revenue:';
    revLabel.style.color = '#6b7280';
    
    const revValue = document.createElement('span');
    revValue.textContent = `$${item.revenue.toLocaleString()}`;
    revValue.style.fontWeight = '700';
    revValue.style.color = '#111827';
    
    revRow.appendChild(revLabel);
    revRow.appendChild(revValue);
    tooltipContent.appendChild(revRow);
    
    tooltipDiv.appendChild(tooltipContent);
    foreignObject.appendChild(tooltipDiv);
    
    // Add hover event to show/hide tooltip
    circleGroup.addEventListener('mouseenter', () => {
      circle.setAttribute('r', '6');
      hoverCircle.setAttribute('stroke-opacity', '1');
      tooltipDiv.style.display = 'block';
    });
    
    circleGroup.addEventListener('mouseleave', () => {
      circle.setAttribute('r', '4');
      hoverCircle.setAttribute('stroke-opacity', '0');
      tooltipDiv.style.display = 'none';
    });
    
    svg.appendChild(text);
    svg.appendChild(circleGroup);
    svg.appendChild(foreignObject);
  });
  
  // Add Y-axis labels
  for (let i = 0; i <= 5; i++) {
    const y = svgHeight - padding.bottom - (svgHeight - padding.top - padding.bottom) * (i / 5);
    const value = Math.round(maxRevenue * (i / 5) / 1000);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = `$${value}k`;
    text.setAttribute('x', padding.left - 10);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#9ca3af');
    
    svg.appendChild(text);
  }
  
  // Add styles for hover effects
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    .data-point {
      transition: r 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: pointer;
    }
    .hover-circle {
      stroke-opacity: 0;
      transition: stroke-opacity 0.3s ease;
    }
    .tooltip-container {
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .data-point-group:hover .tooltip-container {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  svg.appendChild(style);
  
  // Append elements in the correct order
  svg.appendChild(area);
  svg.appendChild(path);
  
  // Clear and append
  chartContainer.innerHTML = '';
  chartContainer.appendChild(svg);
}

// Helper function to generate smooth curve path
function generateSmoothPath(points, isArea = false, areaBaseY = 0) {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const x1 = points[i].x;
    const y1 = points[i].y;
    const x2 = points[i + 1].x;
    const y2 = points[i + 1].y;
    
    // Calculate control points for smooth curve
    const cpX1 = x1 + (x2 - x1) / 3;
    const cpX2 = x1 + 2 * (x2 - x1) / 3;
    
    path += ` C ${cpX1},${y1} ${cpX2},${y2} ${x2},${y2}`;
  }
  
  // For area charts, add the baseline
  if (isArea) {
    const lastPoint = points[points.length - 1];
    path += ` L ${lastPoint.x},${areaBaseY} L ${points[0].x},${areaBaseY} Z`;
  }
  
  return path;
}