import React from 'react';
import { Award, CheckSquare, Square } from 'lucide-react';

export default function DashboardDirectivesTab({
  isHi,
  advisory,
  totalTasks,
  completedCount,
  progressPercent,
  completedTasks,
  toggleTaskCompletion,
  getIconForTitle
}) {
  return (
    <div className="gov-card-body" style={{ padding: '1.25rem' }}>
      {/* Interactive Progress Meter Bar */}
      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        padding: '14px 18px',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#D97706" />
            <strong style={{ fontSize: '0.92rem', color: '#0A3161' }}>
              {isHi ? 'आज के कृषि कार्य प्रगति सूचकांक' : "Today's Agronomy Action Progress"}
            </strong>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
            {isHi 
              ? `कुल ${totalTasks} में से ${completedCount} निर्देश पूर्ण चिह्नित किए गए (${progressPercent}%)` 
              : `${completedCount} of ${totalTasks} actionable field directives completed (${progressPercent}%)`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
          <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${progressPercent}%`, 
                height: '100%', 
                background: progressPercent === 100 ? '#10B981' : '#0A3161',
                transition: 'width 0.3s ease'
              }} 
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: progressPercent === 100 ? '#059669' : '#0A3161' }}>
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Directive Cards Grid with Interactive Checkboxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {advisory?.items?.map((item, index) => {
          const isCompleted = completedTasks.includes(index);
          let borderColor = '#0A3161';
          let badgeBg = '#EFF6FF';
          let badgeColor = '#1E40AF';
          let badgeText = isHi ? 'परामर्श' : 'Advisory';

          if (item.severity === 'urgent') {
            borderColor = '#DC2626';
            badgeBg = '#FEE2E2';
            badgeColor = '#991B1B';
            badgeText = isHi ? 'अत्यावश्यक' : 'Urgent';
          } else if (item.severity === 'important') {
            borderColor = '#D97706';
            badgeBg = '#FEF3C7';
            badgeColor = '#92400E';
            badgeText = isHi ? 'महत्वपूर्ण' : 'Important';
          }

          return (
            <div 
              key={index} 
              className="gov-card interactive-card" 
              style={{ 
                borderTop: `4px solid ${isCompleted ? '#10B981' : borderColor}`,
                background: isCompleted ? '#F0FDF4' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              <div className="gov-card-body" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: isCompleted ? '#DCFCE7' : badgeBg, color: isCompleted ? '#166534' : badgeColor, padding: '7px', borderRadius: '4px' }}>
                      {getIconForTitle(item.title)}
                    </div>
                    <h3 style={{ 
                      fontSize: '0.94rem', 
                      fontWeight: 800, 
                      color: isCompleted ? '#166534' : '#1E293B', 
                      margin: 0,
                      textDecoration: isCompleted ? 'line-through' : 'none'
                    }}>
                      {item.title}
                    </h3>
                  </div>
                  <span style={{ 
                    background: isCompleted ? '#DCFCE7' : badgeBg, 
                    color: isCompleted ? '#166534' : badgeColor, 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    padding: '2px 7px', 
                    borderRadius: '3px', 
                    flexShrink: 0 
                  }}>
                    {isCompleted ? (isHi ? '✓ पूर्ण' : '✓ Done') : badgeText}
                  </span>
                </div>

                <p style={{ color: isCompleted ? '#4B5563' : '#334155', fontSize: '0.86rem', lineHeight: 1.5, margin: '0 0 12px' }}>
                  {item.message}
                </p>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button
                    id={`task-toggle-${index}`}
                    onClick={() => toggleTaskCompletion(index)}
                    style={{
                      background: isCompleted ? '#059669' : '#FFFFFF',
                      color: isCompleted ? '#FFFFFF' : '#0A3161',
                      border: `1px solid ${isCompleted ? '#059669' : '#CBD5E1'}`,
                      padding: '5px 12px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isCompleted ? <CheckSquare size={14} /> : <Square size={14} />}
                    <span>
                      {isCompleted 
                        ? (isHi ? 'किया गया (Click to Undo)' : 'Completed (Click to Undo)') 
                        : (isHi ? 'पूर्ण चिह्नित करें (Mark Done)' : 'Mark as Completed')}
                    </span>
                  </button>

                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600 }}>
                    ICAR Reg: AG-{index + 101}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
