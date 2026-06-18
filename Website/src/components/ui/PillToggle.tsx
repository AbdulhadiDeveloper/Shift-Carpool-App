interface PillToggleProps {
  activeTab: 'UPCOMING' | 'HISTORY';
  onChange: (tab: 'UPCOMING' | 'HISTORY') => void;
}

export default function PillToggle({ activeTab, onChange }: PillToggleProps) {
  return (
    <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/30 w-fit">
      <button
        onClick={() => onChange('UPCOMING')}
        className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
          activeTab === 'UPCOMING'
            ? 'bg-surface-variant text-primary'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        UPCOMING
      </button>
      <button
        onClick={() => onChange('HISTORY')}
        className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-colors shadow-sm ${
          activeTab === 'HISTORY'
            ? 'bg-surface-variant text-primary'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        HISTORY
      </button>
    </div>
  );
}
