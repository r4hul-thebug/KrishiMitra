import React from 'react';
import { Droplets, AlertTriangle, Sun } from 'lucide-react';

export default function DashboardWeatherTab({
  isHi,
  fieldAcres,
  setFieldAcres,
  soilType,
  setSoilType,
  adjustedWater,
  pumpHp5Hours,
  rainProbToday,
  weatherForecast
}) {
  return (
    <div className="gov-card-body" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Interactive Irrigation Water Calculator */}
        <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Droplets size={20} color="#0284C7" />
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0369A1' }}>
              {isHi ? 'स्मार्ट सिंचाई आवश्यकता गणक (Smart Irrigation Planner)' : 'Smart Field Irrigation Estimator'}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label htmlFor="weather-tab-field-area" style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                {isHi ? 'खेत का रकबा (एकड़ में)' : 'Field Area (Acres)'}
              </label>
              <input 
                id="weather-tab-field-area"
                type="number" 
                min="0.5" 
                max="50" 
                step="0.5"
                value={fieldAcres} 
                onChange={(e) => setFieldAcres(Math.max(0.5, parseFloat(e.target.value) || 1))}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem', fontWeight: 800 }}
              />
            </div>

            <div>
              <label htmlFor="weather-tab-soil-texture" style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                {isHi ? 'मिट्टी का प्रकार' : 'Soil Texture'}
              </label>
              <select 
                id="weather-tab-soil-texture"
                value={soilType} 
                onChange={(e) => setSoilType(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', fontSize: '0.85rem' }}
              >
                <option value="alluvial">{isHi ? 'दोमट / जलोढ़ (Alluvial)' : 'Loamy / Alluvial'}</option>
                <option value="black">{isHi ? 'काली मिट्टी (Black Cotton)' : 'Black Clayey'}</option>
                <option value="red">{isHi ? 'लाल मिट्टी (Red Soil)' : 'Red Soil'}</option>
                <option value="sandy">{isHi ? 'बलुई मिट्टी (Sandy)' : 'Sandy Loam'}</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #E0F2FE', borderRadius: '4px', padding: '10px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{isHi ? 'अनुमानित जल मांग:' : 'Est. Water Volume:'}</span>
              <strong style={{ fontSize: '0.95rem', color: '#0369A1' }}>{adjustedWater.toLocaleString('en-IN')} Litres</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{isHi ? 'अनुशंसित ट्यूबवेल समय (5 HP):' : 'Pump Run Time (5 HP):'}</span>
              <strong style={{ fontSize: '0.95rem', color: '#0A3161' }}>~{pumpHp5Hours} Hours</strong>
            </div>
          </div>

          {rainProbToday > 40 && (
            <div style={{ marginTop: '10px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '4px', padding: '8px 10px', fontSize: '0.76rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} color="#B45309" />
              <span>{isHi ? `आज वर्षा सम्भावना ${rainProbToday}% है। 50% सिंचाई स्थगित करने की सलाह दी जाती है।` : `Rain probability is ${rainProbToday}%. Postpone irrigation to conserve energy and groundwater.`}</span>
            </div>
          )}
        </div>

        {/* IMD Source Badge & Advisory */}
        <div style={{ background: '#FAFDFB', border: '1px solid #D1FAE5', borderRadius: '6px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Sun size={20} color="#059669" />
            <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#065F46' }}>
              {isHi ? 'आईएमडी कृषि मौसम बुलेटिन' : 'IMD Agrometeorological Advisory'}
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.6, margin: '0 0 10px' }}>
            {isHi 
              ? 'वर्तमान मौसमी परिस्थितियों में पत्तियों पर फफूंद व कीट संक्रमण की संभावना कम है। अगले 3 दिनों में सुबह के समय कीटनाशक व सूक्ष्म पोषक तत्वों का पर्णीय छिड़काव (Foliar Spray) उत्तम रहेगा।'
              : 'Foliar application of micronutrients and systemic fungicides is recommended during early morning hours over the next 48 hours.'}
          </p>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
            ✓ Source: India Meteorological Department, Pune Division
          </div>
        </div>

      </div>

      {/* 7-Day Table */}
      {weatherForecast?.days && weatherForecast.days.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
          <table className="gov-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>{isHi ? 'दिनांक / दिवस' : 'Date / Day'}</th>
                <th>{isHi ? 'तापमान (अधिकतम / न्यूनतम)' : 'Temp (Max / Min)'}</th>
                <th>{isHi ? 'संभावित वर्षा' : 'Rainfall (mm)'}</th>
                <th>{isHi ? 'वर्षा सम्भावना' : 'Rain Chance'}</th>
                <th>{isHi ? 'कृषि कार्य अनुकूलता' : 'Field Work Status'}</th>
              </tr>
            </thead>
            <tbody>
              {weatherForecast.days.map((day, idx) => {
                const isRainLikely = day.rainMm > 2 || (day.rainChance && day.rainChance > 40);
                return (
                  <tr key={idx} style={{ background: idx === 0 ? '#EFF6FF' : 'transparent' }}>
                    <td>
                      <strong style={{ color: idx === 0 ? '#0A3161' : '#1E293B', fontSize: '0.84rem' }}>
                        {idx === 0 ? (isHi ? 'आज (Today)' : 'Today') : (day.date || `Day ${idx + 1}`)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{Math.round(day.tMaxC)}°C</span> / <span style={{ color: '#64748B' }}>{Math.round(day.tMinC)}°C</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: day.rainMm > 5 ? '#DC2626' : day.rainMm > 0 ? '#0284C7' : '#64748B' }}>
                        {day.rainMm} mm
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '70px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${day.rainChance || 0}%`, height: '100%', background: isRainLikely ? '#0284C7' : '#94A3B8' }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{day.rainChance}%</span>
                      </div>
                    </td>
                    <td>
                      {isRainLikely ? (
                        <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '3px', border: '1px solid #FCD34D' }}>
                          {isHi ? 'सिंचाई / छिड़काव रोकें' : 'Hold spray / irrigation'}
                        </span>
                      ) : (
                        <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '3px', border: '1px solid #A7F3D0' }}>
                          {isHi ? 'कृषि कार्य हेतु उत्तम' : 'Optimal for field work'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
