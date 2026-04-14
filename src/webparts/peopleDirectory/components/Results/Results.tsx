import * as React from 'react';
import { IResultsProps } from './IResultsProps';
import styles from './Results.module.scss';
import { Spinner,SpinnerSize,Text } from '@fluentui/react';
import Result from './Result';

const Results: React.FC<IResultsProps> = ({ results, loading,onUserClick  }) => {
  return (
    <div className={styles.results}>
      {loading ? (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Spinner size={SpinnerSize.large} />
        </div>
      ) : results.length > 0 ? (
        <div className={styles.searchResults}>
          {/* {results.map((item) => (
            <div className={styles.result} key={item.id}>
              <Result
                dataContext={{
                  person: {
                    userId: item.id,
                    ...item
                  }
                }}
              /> */}
              {results.map((item) => (
  <div
    className={styles.result}
    key={item.id}
    onClick={() => onUserClick(item)} // 🔥 IMPORTANT
    style={{ cursor: 'pointer' }}
  >
    <Result
      dataContext={{
        person: {
          userId: item.id,
          ...item
        }
      }}
    />
  
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 4px' }}>
          <Text variant='mediumPlus' as='span'>
            No results found
          </Text>
        </div>
      )}
    </div>
  );
};

export default Results;