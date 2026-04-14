import * as React from 'react';
import styles from './PeopleDirectory.module.scss';
import type { IPeopleDirectoryProps } from './IPeopleDirectoryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import useSearch from '../hooks/useSearch';
import Search from './Search/Search';
import Results from './Results/Results';
import Paging from './Paging/Paging';
import { IPerson } from '../interfaces/IPerson';
import { Dropdown, IDropdownOption, Text } from '@fluentui/react';
import './global.css'
import AlphabetFilter from './AlphabetFilter/AlphabetFilter';
import ProfilePanel from './ProfilePanel/ProfilePanel';

interface IStaffDirectoryState {
  search: string;
  page: number;
  items: IPerson[];
  selected: string | number;
   letter: string; // 👈
    selectedUser: any;      // 👈 better type later
  isPanelOpen: boolean;
}

const PeopleDirectory :React.FC<IPeopleDirectoryProps>=({
 title,
  isDarkTheme,
  showDepartmentFilter,
  departments,
  group,
  userDisplayName,
  pageSize,
  context
})=>{
   const [state, setState] = React.useState<IStaffDirectoryState>({
    search: '',
    page: 1,
    items: [],
    selected: '',
     letter: '', // '' means ALL,
     selectedUser: null,
isPanelOpen: false
  });
  const { total, searchByText, getNextPage, loading, results } =
    useSearch(context, group, pageSize);

  const handleChange = React.useCallback(
    (
      event?: React.ChangeEvent<HTMLInputElement> | undefined,
      newValue?: string | undefined
    ) => {
      setState((s) => {
        return {
          ...s,
          search: newValue || ''
        };
      });
    },
    []
  );

   const resetSearch = React.useCallback(() => {
    setState((s) => {
      return {
        ...s,
        search: ''
      };
    });
  }, []);

  const handleSubmit = React.useCallback(async () => {
    const { search, selected } = state;

    setState((s) => ({
      ...s,
      items: [],
      page: 1
    }));

    await searchByText(search, selected.toString()).catch((e) =>
      console.error(e)
    );
  }, [searchByText, state]);
   const goToPage = React.useCallback(
    async (v: number) => {
      if (v > state.page) {
        await getNextPage();
      }

      setState((s) => ({
        ...s,
        page: v
      }));
    },
    [getNextPage, state]
  );

  const handleDropdown = React.useCallback(
    (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption | undefined,
      index?: number | undefined
    ) => {
      setState((s) => ({
        ...s,
        selected: option?.key ?? ''
      }));
    },
    []
  );

  const load = React.useCallback(async () => {
    await searchByText('', state.selected as string).catch(e => console.error(e));
  }, [group, state]);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      items: [],
      search: '',
      page: 1
    }));

    load().catch((e) => console.error(e));
  }, [group, state.selected]);

  React.useEffect(() => {
    setState((s) => ({
      ...s,
      items: [...s.items, ...results]
    }));
  }, [results]);
//   const filteredItems = React.useMemo(() => {
//   if (!state.letter) return state.items;

//   return state.items.filter((item) =>
//     item.displayName?.toLowerCase().startsWith(state.letter.toLowerCase())
//   );
// }, [state.items, state.letter]);

const filteredItems = React.useMemo(() => {
  if (!state.letter) return state.items;

  return state.items.filter((item) =>
    item.displayName?.toLowerCase().startsWith(state.letter.toLowerCase())
  );
}, [state.items, state.letter]);


//  const displayedItems = React.useMemo(() => {
//   const { page } = state;
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = page * pageSize;

//   return filteredItems.slice(startIndex, endIndex);
// }, [filteredItems, state.page, pageSize]);
  
const displayedItems = React.useMemo(() => {
  const { page } = state;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  return filteredItems.slice(startIndex, endIndex);
}, [filteredItems, state.page]);
return(
    <>
    <section className={styles.peopleDirectory}>
      <div>
        <div className={styles.title}>
          <Text as='h1' variant='xLarge'>
            {title}
          </Text>
        </div>
        <div className={styles.search}>
          <Search
            placeholder='Search name, department, or job title'
            onChange={handleChange}
            onClear={resetSearch}
            onSearch={handleSubmit}
            value={state.search}
            className={styles.searchBar}
          />
          
          {showDepartmentFilter && (
            <Dropdown
              options={[
                {
                  key: '',
                  text: 'All departments'
                },
                ...departments
              ]}
              placeholder='Select department'
              selectedKey={state.selected}
              onChange={handleDropdown}
              className={styles.dropdown}
            />
          )}
        </div>
        {/* <div style={{ marginTop: 10 }}>
  {['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((char) => (
    <button
      key={char}
      onClick={() => {
        setState((s) => ({
          ...s,
          letter: char === 'All' ? '' : char,
          page: 1
        }));
      }}
      style={{
        margin: '2px',
        padding: '6px 10px',
        background: state.letter === char || (char === 'All' && state.letter === '')
          ? '#0078d4'
          : '#f3f2f1',
        color:
          state.letter === char || (char === 'All' && state.letter === '')
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
</div> */}
<AlphabetFilter
  selected={state.letter}
  onSelect={(letter) =>
    setState((s) => ({
      ...s,
      letter,
      page: 1
    }))
  }
/>
        <br style={{ margin: '2px 0' }} />
        <Paging
          count={total}
          page={state.page}
          pageSize={pageSize}
          onPageChange={goToPage}
        />
        <br style={{ margin: '6px 0' }} />
        <Results
  results={displayedItems}
  loading={loading}
  onUserClick={(user) =>
    setState((s) => ({
      ...s,
      selectedUser: user,
      isPanelOpen: true
    }))
  }
/>
<ProfilePanel
  user={state.selectedUser}
  isOpen={state.isPanelOpen}
  onDismiss={() =>
    setState((s) => ({
      ...s,
      isPanelOpen: false
    }))
  }
/>
      </div>
    </section>
    </>
  )
}
export default PeopleDirectory ;
