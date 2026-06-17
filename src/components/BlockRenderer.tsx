import React, { useState, useRef, useEffect } from 'react';
import type { BlockDef, InputSlot } from '../blocks/blockDefinitions';

interface BlockRendererProps {
  block: BlockDef;
  color: string;
  secondaryColor: string;
  compact?: boolean;
  editable?: boolean;
  blockId?: string;
  blockInputs?: Record<string, string | number | boolean>;
  onInputChange?: (key: string, value: string | number) => void;
}

export default function BlockRenderer({ block, color, secondaryColor, editable, blockId, blockInputs, onInputChange }: BlockRendererProps) {
  const label = buildLabel(block, editable, blockInputs, onInputChange);

  switch (block.shape) {
    case 'hat':
      return <HatBlock label={label} color={color} secondary={secondaryColor} />;
    case 'reporter':
      return <ReporterBlock label={label} color={color} secondary={secondaryColor} />;
    case 'boolean':
      return <BooleanBlock label={label} color={color} secondary={secondaryColor} />;
    case 'c-block':
      return <CBlock label={label} color={color} secondary={secondaryColor} hasElse={block.hasElseMouth} />;
    case 'cap':
      return <CapBlock label={label} color={color} secondary={secondaryColor} />;
    case 'stack':
    default:
      return <StackBlock label={label} color={color} secondary={secondaryColor} />;
  }
}

function buildLabel(
  block: BlockDef,
  editable?: boolean,
  blockInputs?: Record<string, string | number | boolean>,
  onInputChange?: (key: string, value: string | number) => void
): React.ReactNode {
  const parts = block.label.split(/(%\w+)/g);
  return (
    <span className="block__label">
      {parts.map((part, i) => {
        if (part.startsWith('%') && block.inputs) {
          const key = part.slice(1);
          const input = block.inputs[key];
          if (!input) return <span key={i}>{part}</span>;

          const currentValue = blockInputs?.[key] ?? input.default ?? '';

          if (editable && onInputChange) {
            return <EditableInput key={i} inputDef={input} inputKey={key} value={currentValue} onChange={onInputChange} />;
          }

          // Static display (palette)
          if (input.type === 'number') {
            return <span key={i} className="block__input block__input--number">{String(currentValue)}</span>;
          }
          if (input.type === 'string') {
            return <span key={i} className="block__input block__input--string">{String(currentValue)}</span>;
          }
          if (input.type === 'dropdown') {
            return <span key={i} className="block__input block__input--dropdown">{String(currentValue)} ▾</span>;
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function EditableInput({
  inputDef,
  inputKey,
  value,
  onChange,
}: {
  inputDef: InputSlot;
  inputKey: string;
  value: string | number | boolean;
  onChange: (key: string, value: string | number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalVal(String(value));
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const newVal = inputDef.type === 'number' ? Number(localVal) || 0 : localVal;
    onChange(inputKey, newVal);
  };

  if (inputDef.type === 'dropdown') {
    return (
      <select
        className="block__input block__input--dropdown block__input--editable"
        value={String(value)}
        onChange={(e) => {
          e.stopPropagation();
          onChange(inputKey, e.target.value);
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {(inputDef.options ?? []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`block__input block__input--${inputDef.type} block__input--editing`}
        type={inputDef.type === 'number' ? 'number' : 'text'}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setLocalVal(String(value)); setEditing(false); }
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      className={`block__input block__input--${inputDef.type} block__input--clickable`}
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {String(value)}
    </span>
  );
}

function StackBlock({ label, color, secondary }: { label: React.ReactNode; color: string; secondary: string }) {
  return (
    <div className="block block--stack" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__notch-top" />
      <div className="block__body">{label}</div>
      <div className="block__notch-bottom" />
    </div>
  );
}

function HatBlock({ label, color, secondary }: { label: React.ReactNode; color: string; secondary: string }) {
  return (
    <div className="block block--hat" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__hat-top" />
      <div className="block__body">{label}</div>
      <div className="block__notch-bottom" />
    </div>
  );
}

function CapBlock({ label, color, secondary }: { label: React.ReactNode; color: string; secondary: string }) {
  return (
    <div className="block block--cap" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__notch-top" />
      <div className="block__body">{label}</div>
      <div className="block__cap-bottom" />
    </div>
  );
}

function ReporterBlock({ label, color, secondary }: { label: React.ReactNode; color: string; secondary: string }) {
  return (
    <div className="block block--reporter" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__body">{label}</div>
    </div>
  );
}

function BooleanBlock({ label, color, secondary }: { label: React.ReactNode; color: string; secondary: string }) {
  return (
    <div className="block block--boolean" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__body">{label}</div>
    </div>
  );
}

function CBlock({ label, color, secondary, hasElse }: { label: React.ReactNode; color: string; secondary: string; hasElse?: boolean }) {
  return (
    <div className="block block--cblock" style={{ '--block-color': color, '--block-secondary': secondary } as React.CSSProperties}>
      <div className="block__notch-top" />
      <div className="block__body">{label}</div>
      <div className="block__mouth">
        <div className="block__mouth-inner" />
      </div>
      {hasElse && (
        <>
          <div className="block__else-bar">
            <div className="block__body"><span className="block__label">else</span></div>
          </div>
          <div className="block__mouth">
            <div className="block__mouth-inner" />
          </div>
        </>
      )}
      <div className="block__cblock-bottom" />
    </div>
  );
}
