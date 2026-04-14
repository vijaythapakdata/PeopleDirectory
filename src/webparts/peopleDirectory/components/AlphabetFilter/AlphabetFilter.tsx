import * as React from 'react';

interface IAlphabetFilterProps {
  selected: string;
  onSelect: (letter: string) => void;
}

const AlphabetFilter: React.FC<IAlphabetFilterProps> = ({ selected, onSelect }) => {
  const letters = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div style={{ marginTop: 10 }}>
      {letters.map((char) => (
        <button
          key={char}
          onClick={() => onSelect(char === 'All' ? '' : char)}
          style={{
            margin: '2px',
            padding: '6px 10px',
            background: selected === char || (char === 'All' && selected === '')
              ? '#0078d4'
              : '#f3f2f1',
            color:
              selected === char || (char === 'All' && selected === '')
                ? 'white'
                : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default AlphabetFilter;